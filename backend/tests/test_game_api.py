from app.api import game as game_module
from app.services.game_logic import GameLogic


def start_session(client, difficulty="easy", operation_type="addition_subtraction"):
    response = client.post(
        "/api/game/start",
        params={"difficulty": difficulty, "operation_type": operation_type},
    )
    assert response.status_code == 200
    return response.json()


def test_start_game(client):
    data = start_session(client)
    assert "session_id" in data
    assert isinstance(data["problem"], str) and data["problem"]
    assert data["time_remaining"] == 120
    assert data["session_id"] in game_module.active_sessions


def test_submit_correct_answer(client):
    data = start_session(client)
    session_id = data["session_id"]
    true_answer = game_module.active_sessions[session_id]["current_problem"].answer

    response = client.post(
        "/api/game/answer",
        json={"session_id": session_id, "answer": true_answer, "time_taken": 1.5},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["is_correct"] is True
    assert body["correct_answer"] is None
    assert body["score"] == 1
    assert body["total_problems"] == 1
    assert isinstance(body["next_problem"], str) and body["next_problem"]


def test_submit_incorrect_answer(client):
    data = start_session(client)
    session_id = data["session_id"]
    true_answer = game_module.active_sessions[session_id]["current_problem"].answer
    wrong_answer = true_answer + 1000

    response = client.post(
        "/api/game/answer",
        json={"session_id": session_id, "answer": wrong_answer, "time_taken": 1.5},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["is_correct"] is False
    assert body["correct_answer"] == true_answer
    assert body["score"] == 0
    assert body["total_problems"] == 1


def test_submit_answer_unknown_session(client):
    response = client.post(
        "/api/game/answer",
        json={"session_id": "does-not-exist", "answer": 1, "time_taken": 1.0},
    )
    assert response.status_code == 404


def test_submit_answer_after_time_expired_returns_game_result_and_ends_session(client):
    data = start_session(client)
    session_id = data["session_id"]
    game_module.active_sessions[session_id]["start_time"] -= 121

    response = client.post(
        "/api/game/answer",
        json={"session_id": session_id, "answer": 0, "time_taken": 1.0},
    )
    assert response.status_code == 200
    body = response.json()
    # Response matches GameResult shape, not the answer shape.
    assert body["session_id"] == session_id
    assert "score" in body and "total_problems" in body and "xp_earned" in body
    assert "is_correct" not in body
    assert session_id not in game_module.active_sessions
    assert session_id in game_module.game_results


def test_end_game(client):
    data = start_session(client)
    session_id = data["session_id"]

    response = client.post(f"/api/game/end/{session_id}")
    assert response.status_code == 200
    body = response.json()
    assert body["session_id"] == session_id
    assert body["score"] == 0
    assert body["total_problems"] == 0
    assert body["accuracy"] == 0
    assert "xp_earned" in body

    assert session_id not in game_module.active_sessions
    assert session_id in game_module.game_results

    # Ending again fails since the session was removed.
    second_response = client.post(f"/api/game/end/{session_id}")
    assert second_response.status_code == 404


def test_end_game_unknown_session(client):
    response = client.post("/api/game/end/does-not-exist")
    assert response.status_code == 404


def test_leaderboard_sorted_and_capped(client):
    for i in range(12):
        data = start_session(client)
        session_id = data["session_id"]
        game_module.active_sessions[session_id]["score"] = i
        game_module.active_sessions[session_id]["total_problems"] = i + 1
        client.post(f"/api/game/end/{session_id}")

    response = client.get("/api/game/leaderboard")
    assert response.status_code == 200
    scores = [entry["score"] for entry in response.json()]
    assert len(scores) <= 10
    assert scores == sorted(scores, reverse=True)


def test_ninja_belt_endpoint_matches_game_logic(client):
    for xp in (0, 99, 100, 1500):
        response = client.get(f"/api/game/ninja-belt/{xp}")
        assert response.status_code == 200
        body = response.json()
        assert body["belt"] == GameLogic.get_ninja_belt(xp)
        assert body["level"] == GameLogic.get_level(xp)
