"""Unit tests for backend/app/main.py.

Covers what the ticket's title names: the FastAPI app object itself --
its metadata, the one real route it exposes (/health), the CORS policy
that lets the SPA call it, and that ALLOWED_ORIGINS actually changes that
policy rather than being read and ignored.

No acceptance criteria were attached to this ticket, so the assumptions
made here are noted in the ticket's `notes` rather than asserted as if
they were specified: that /health is the contract to protect (it is the
only non-stub route in the file), and that the CORS origin list is the
other externally-observable behaviour worth locking down.
"""

import importlib

import pytest
from fastapi.testclient import TestClient

from app import main as main_module


@pytest.fixture
def client() -> TestClient:
    return TestClient(main_module.app)


def test_health_returns_ok_status(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_health_is_get_only(client: TestClient) -> None:
    # A stray POST should not silently succeed against a liveness probe.
    response = client.post("/health")

    assert response.status_code == 405


def test_app_metadata_matches_generated_spec(client: TestClient) -> None:
    assert main_module.app.title == "A website for kohli"
    assert main_module.app.version == "0.1.0"
    assert "kohli" in main_module.app.description.lower()


def test_openapi_document_is_served(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    schema = response.json()
    assert schema["info"]["title"] == "A website for kohli"
    assert "/health" in schema["paths"]


def test_docs_ui_is_served(client: TestClient) -> None:
    response = client.get("/docs")

    assert response.status_code == 200


def test_cors_allows_default_dev_origin(client: TestClient) -> None:
    origin = "http://localhost:5173"

    response = client.get("/health", headers={"Origin": origin})

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin


def test_cors_allows_default_dev_origin_127(client: TestClient) -> None:
    origin = "http://127.0.0.1:5173"

    response = client.get("/health", headers={"Origin": origin})

    assert response.headers.get("access-control-allow-origin") == origin


def test_cors_rejects_origin_not_on_the_list(client: TestClient) -> None:
    # Some unrelated site should not be able to read the response cross-origin.
    response = client.get("/health", headers={"Origin": "http://evil.example.com"})

    assert response.status_code == 200  # the request itself still succeeds
    assert "access-control-allow-origin" not in response.headers


def test_allowed_origins_env_var_replaces_dev_defaults(monkeypatch: pytest.MonkeyPatch) -> None:
    """ALLOWED_ORIGINS, when set, must be the origin list the middleware uses --
    not merely read and discarded in favour of the dev defaults."""
    deployed_origin = "https://kohli-website.example.com"
    monkeypatch.setenv("ALLOWED_ORIGINS", deployed_origin)

    reloaded = importlib.reload(main_module)
    try:
        with TestClient(reloaded.app) as reloaded_client:
            allowed = reloaded_client.get(
                "/health", headers={"Origin": deployed_origin}
            )
            assert allowed.headers.get("access-control-allow-origin") == deployed_origin

            dev_default = reloaded_client.get(
                "/health", headers={"Origin": "http://localhost:5173"}
            )
            assert "access-control-allow-origin" not in dev_default.headers
    finally:
        # Restore the module the rest of the test session imports from.
        monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)
        importlib.reload(main_module)
