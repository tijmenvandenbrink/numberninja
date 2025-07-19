from fastapi import APIRouter, HTTPException
from typing import Dict
import uuid
import time
from ..models.game import GameSession, Problem, Answer, GameResult, DifficultyLevel, OperationType
from ..services.game_logic import GameLogic

router = APIRouter(prefix="/api/game", tags=["game"])

# In-memory storage for demo (replace with database in production)
active_sessions: Dict[str, dict] = {}
game_results: Dict[str, GameResult] = {}

@router.post("/start", response_model=dict)
async def start_game(difficulty: DifficultyLevel, operation_type: OperationType):
    session_id = str(uuid.uuid4())
    session = GameSession(
        session_id=session_id,
        difficulty=difficulty,
        operation_type=operation_type
    )
    
    # Generate first problem
    problem = GameLogic.generate_problem(difficulty, operation_type)
    
    active_sessions[session_id] = {
        "session": session,
        "start_time": time.time(),
        "current_problem": problem,
        "score": 0,
        "total_problems": 0,
        "problems_history": []
    }
    
    return {
        "session_id": session_id,
        "problem": problem.problem,
        "time_remaining": 120
    }

@router.post("/answer", response_model=dict)
async def submit_answer(answer_data: Answer):
    session_id = answer_data.session_id
    
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_data = active_sessions[session_id]
    current_problem = session_data["current_problem"]
    
    # Check if time is up
    elapsed_time = time.time() - session_data["start_time"]
    if elapsed_time >= 120:
        return await end_game(session_id)
    
    # Check answer
    is_correct = answer_data.answer == current_problem.answer
    session_data["total_problems"] += 1
    
    if is_correct:
        session_data["score"] += 1
    
    session_data["problems_history"].append({
        "problem": current_problem.problem,
        "correct_answer": current_problem.answer,
        "user_answer": answer_data.answer,
        "is_correct": is_correct,
        "time_taken": answer_data.time_taken
    })
    
    # Generate next problem
    session = session_data["session"]
    next_problem = GameLogic.generate_problem(session.difficulty, session.operation_type)
    session_data["current_problem"] = next_problem
    
    time_remaining = max(0, 120 - elapsed_time)
    
    return {
        "is_correct": is_correct,
        "correct_answer": current_problem.answer if not is_correct else None,
        "next_problem": next_problem.problem,
        "score": session_data["score"],
        "time_remaining": int(time_remaining),
        "total_problems": session_data["total_problems"]
    }

@router.post("/end/{session_id}", response_model=GameResult)
async def end_game(session_id: str):
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_data = active_sessions[session_id]
    session = session_data["session"]
    
    # Calculate final results
    score = session_data["score"]
    total_problems = session_data["total_problems"]
    accuracy = (score / total_problems * 100) if total_problems > 0 else 0
    time_taken = int(time.time() - session_data["start_time"])
    xp_earned = GameLogic.calculate_xp(score, total_problems, session.difficulty)
    
    result = GameResult(
        session_id=session_id,
        score=score,
        total_problems=total_problems,
        accuracy=accuracy,
        time_taken=time_taken,
        xp_earned=xp_earned
    )
    
    game_results[session_id] = result
    del active_sessions[session_id]
    
    return result

@router.get("/leaderboard")
async def get_leaderboard():
    # Return top 10 scores
    sorted_results = sorted(
        game_results.values(),
        key=lambda x: x.score,
        reverse=True
    )
    return sorted_results[:10]

@router.get("/ninja-belt/{xp}")
async def get_ninja_belt(xp: int):
    return {
        "belt": GameLogic.get_ninja_belt(xp),
        "level": GameLogic.get_level(xp)
    }