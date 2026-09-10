"""Unit tests for backend/app/models.py.

The approved architecture declared no data model, so models.py is currently
an empty module: it defines no tables of its own, only re-exports the
`Base` that app/database.py binds to the engine. These tests pin down what
that empty module actually guarantees -- that it exposes the same `Base`
the rest of the app uses, that it registers no tables of its own, and that
it is safe for app/main.py to import it and run `create_all` against it --
rather than testing a table that does not exist.
"""

import sqlalchemy as sa
from sqlalchemy import inspect

from app import models
from app.database import Base as DatabaseBase


def test_models_reexports_the_shared_base():
    """app.models.Base must be the exact object app.database defines.

    main.py imports app.models "so the tables register before create_all"
    runs against app.database.Base -- that only works if it is the same
    class, not a lookalike.
    """
    assert models.Base is DatabaseBase


def test_public_api_is_only_base():
    """__all__ documents the module's surface; it should be exactly Base."""
    assert models.__all__ == ["Base"]
    assert not hasattr(models, "Model")  # no stray table class snuck in


def test_no_tables_registered_yet():
    """No model classes exist yet, so the shared metadata has no tables.

    This is the module's current, documented state (see its docstring). If
    this assertion ever fails because a table has been added, the fixture
    below (create_all against a throwaway engine) is what should be
    extended alongside the new model -- not deleted.
    """
    assert models.Base.metadata.tables == {}


def test_create_all_runs_cleanly_against_an_empty_schema():
    """Base.metadata.create_all must not error even with zero tables.

    This is exactly what app/main.py does at import time against the real
    engine; running it here against a disposable in-memory engine proves
    the module is safe to wire into startup without needing the full app.
    """
    throwaway_engine = sa.create_engine("sqlite:///:memory:")

    # Must not raise.
    models.Base.metadata.create_all(bind=throwaway_engine)

    inspector = inspect(throwaway_engine)
    assert inspector.get_table_names() == []


def test_app_starts_with_the_empty_model_module():
    """Importing app.main (which imports app.models then calls create_all
    against the real engine) must succeed and serve requests -- the
    integration point this whole module exists to support.
    """
    from fastapi.testclient import TestClient

    from app.main import app

    client = TestClient(app)
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
