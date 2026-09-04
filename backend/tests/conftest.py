import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.api import game as game_module


@pytest.fixture(autouse=True)
def clean_game_state():
    game_module.active_sessions.clear()
    game_module.game_results.clear()
    yield
    game_module.active_sessions.clear()
    game_module.game_results.clear()


@pytest.fixture
def client():
    return TestClient(app)
