from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class OperationType(str, Enum):
    ADDITION_SUBTRACTION = "addition_subtraction"
    MULTIPLICATION_DIVISION = "multiplication_division"

class Problem(BaseModel):
    problem: str
    answer: int
    difficulty: DifficultyLevel
    operation_type: OperationType

class GameSession(BaseModel):
    session_id: str
    difficulty: DifficultyLevel
    operation_type: OperationType
    duration_seconds: int = 120

class GameResult(BaseModel):
    session_id: str
    score: int
    total_problems: int
    accuracy: float
    time_taken: int
    xp_earned: int

class Player(BaseModel):
    id: Optional[str] = None
    name: str
    level: int = 1
    xp: int = 0
    ninja_belt: str = "white"
    total_score: int = 0

class Answer(BaseModel):
    session_id: str
    answer: int
    time_taken: float