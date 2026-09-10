"""Unit tests for backend/app/schemas.py.

The ticket carries no acceptance criteria, so what is asserted here is the
contract `schemas.py` itself claims to provide: `StubResponse` is the typed
placeholder every generated route returns, so its `endpoint` field must be
required (the caller has to say which route answered), its `status` and
`detail` fields must default to the values documented in the module's own
docstring (routes that never override them still need a wire-compatible
response), and the model must actually validate its inputs and serialise
predictably -- not merely exist as an unused class.

Assumption: no acceptance criteria were attached, so "endpoint is required"
and "status/detail default as documented" are read from the module's own
docstrings and field defaults as the intended contract, the same way
test_main.py treats /health as the contract worth protecting for that
ticket. If schemas.py grows request/response pairs for real entities later,
those get their own test functions rather than being inferred here.
"""

import pytest
from pydantic import ValidationError

from app.schemas import StubResponse


def test_stub_response_requires_endpoint() -> None:
    with pytest.raises(ValidationError):
        StubResponse()


def test_stub_response_endpoint_is_only_required_field() -> None:
    response = StubResponse(endpoint="/health")

    assert response.endpoint == "/health"


def test_stub_response_defaults_status_to_not_implemented() -> None:
    response = StubResponse(endpoint="/foo")

    assert response.status == "not_implemented"


def test_stub_response_defaults_detail_to_documented_message() -> None:
    response = StubResponse(endpoint="/foo")

    assert response.detail == "Scaffolded from the approved API spec; no behaviour yet."


def test_stub_response_defaults_can_be_overridden() -> None:
    response = StubResponse(
        endpoint="/foo",
        status="ok",
        detail="handled",
    )

    assert response.status == "ok"
    assert response.detail == "handled"


def test_stub_response_rejects_non_string_endpoint_that_cannot_coerce() -> None:
    with pytest.raises(ValidationError):
        StubResponse(endpoint={"not": "a string"})


def test_stub_response_serialises_to_the_shape_a_client_expects() -> None:
    response = StubResponse(endpoint="/players")

    assert response.model_dump() == {
        "endpoint": "/players",
        "status": "not_implemented",
        "detail": "Scaffolded from the approved API spec; no behaviour yet.",
    }


def test_stub_response_json_schema_marks_endpoint_as_required() -> None:
    schema = StubResponse.model_json_schema()

    assert schema["required"] == ["endpoint"]
    assert "status" not in schema.get("required", [])
    assert "detail" not in schema.get("required", [])
