"""Unit tests for app.database: engine/session configuration and get_db.

The module has no acceptance criteria of its own -- it is the scaffold's
engine, session factory and request-scoped session dependency -- so these
tests hold it to what its own docstrings promise: SQLite by default with no
server required, DATABASE_URL swaps the backend without other code changing,
SQLite gets the check_same_thread escape hatch and nothing else does, and
get_db hands out one session per request and always closes it, including when
the handler raises.
"""

import importlib
import os
from unittest.mock import MagicMock

import pytest
from sqlalchemy import text
from sqlalchemy.orm import DeclarativeBase, Session

from app import database


def _reload_with_env(value: str | None):
    """Reload app.database with DATABASE_URL set to `value` (or unset).

    DATABASE_URL is read once, at import time, so exercising the branches it
    controls means re-importing the module with the env var changed.
    """
    if value is None:
        os.environ.pop("DATABASE_URL", None)
    else:
        os.environ["DATABASE_URL"] = value
    return importlib.reload(database)


@pytest.fixture(autouse=True)
def _restore_database_module():
    """Put the real app.database back the way the rest of the suite expects it.

    Some tests below reload the module against a different DATABASE_URL to
    exercise that branch; without this, later tests (or other test files
    importing app.database) would see whatever env var the last reload left
    behind.
    """
    original_env = os.environ.get("DATABASE_URL")
    yield
    if original_env is None:
        os.environ.pop("DATABASE_URL", None)
    else:
        os.environ["DATABASE_URL"] = original_env
    importlib.reload(database)


def test_database_url_defaults_to_sqlite_with_no_server_required():
    mod = _reload_with_env(None)
    assert mod.DATABASE_URL == "sqlite:///./app.db"
    assert str(mod.engine.url) == "sqlite:///./app.db"


def test_database_url_env_var_swaps_the_backend():
    mod = _reload_with_env("sqlite:///./custom_test.db")
    assert mod.DATABASE_URL == "sqlite:///./custom_test.db"
    assert str(mod.engine.url) == "sqlite:///./custom_test.db"


def test_sqlite_gets_check_same_thread_disabled():
    mod = _reload_with_env("sqlite:///./app.db")
    assert mod._connect_args == {"check_same_thread": False}


def test_non_sqlite_url_gets_no_connect_args():
    # A driver-qualified postgres URL: create_engine only has to import the
    # dialect here, not reach a real server, so this stays a unit test.
    mod = _reload_with_env("postgresql+psycopg://user:pass@localhost/db")
    assert mod._connect_args == {}
    assert mod.engine.url.get_backend_name() == "postgresql"


def test_session_factory_is_bound_to_the_engine_with_no_expire_on_commit():
    assert database.SessionLocal.kw["bind"] is database.engine
    assert database.SessionLocal.kw["autoflush"] is False
    assert database.SessionLocal.kw["expire_on_commit"] is False


def test_base_is_a_declarative_base_every_model_can_inherit():
    assert issubclass(database.Base, DeclarativeBase)
    assert hasattr(database.Base, "metadata")


def test_get_db_yields_a_working_session_against_the_real_engine():
    """End-to-end against the real (sqlite) engine, not a mock: the object
    the dependency hands out has to actually work as a session."""
    gen = database.get_db()
    session = next(gen)
    assert isinstance(session, Session)
    assert session.execute(text("SELECT 1")).scalar() == 1
    with pytest.raises(StopIteration):
        next(gen)


def test_get_db_closes_the_session_after_the_request(monkeypatch):
    session = MagicMock(spec=Session)
    monkeypatch.setattr(database, "SessionLocal", lambda: session)

    gen = database.get_db()
    yielded = next(gen)

    assert yielded is session
    session.close.assert_not_called()

    with pytest.raises(StopIteration):
        next(gen)
    session.close.assert_called_once()


def test_get_db_closes_the_session_even_when_the_handler_raises(monkeypatch):
    session = MagicMock(spec=Session)
    monkeypatch.setattr(database, "SessionLocal", lambda: session)

    gen = database.get_db()
    next(gen)

    with pytest.raises(ValueError):
        gen.throw(ValueError("handler blew up"))

    session.close.assert_called_once()


def test_get_db_yields_a_fresh_session_per_call(monkeypatch):
    created = [MagicMock(spec=Session), MagicMock(spec=Session)]
    monkeypatch.setattr(database, "SessionLocal", lambda: created.pop(0))

    first = next(database.get_db())
    second = next(database.get_db())

    assert first is not second
