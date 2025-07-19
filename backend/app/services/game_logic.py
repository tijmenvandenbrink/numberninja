import random
from typing import Tuple
from ..models.game import DifficultyLevel, OperationType, Problem

class GameLogic:
    DIFFICULTY_RANGES = {
        DifficultyLevel.EASY: 10,
        DifficultyLevel.MEDIUM: 20,
        DifficultyLevel.HARD: 50
    }
    
    NINJA_BELTS = ["white", "yellow", "green", "brown", "black", "master"]
    
    @classmethod
    def generate_problem(cls, difficulty: DifficultyLevel, operation_type: OperationType) -> Problem:
        max_num = cls.DIFFICULTY_RANGES[difficulty]
        
        if operation_type == OperationType.ADDITION_SUBTRACTION:
            operation = random.choice(['+', '-'])
            a = random.randint(1, max_num)
            b = random.randint(1, max_num)
            
            if operation == '+':
                answer = a + b
                problem_text = f"{a} + {b}"
            else:
                if a < b:
                    a, b = b, a
                answer = a - b
                problem_text = f"{a} - {b}"
                
        else:  # MULTIPLICATION_DIVISION
            operation = random.choice(['×', '÷'])
            
            if operation == '×':
                a = random.randint(1, min(max_num, 12))
                b = random.randint(1, min(max_num, 12))
                answer = a * b
                problem_text = f"{a} × {b}"
            else:
                answer = random.randint(1, max_num)
                b = random.randint(2, min(max_num, 12))
                a = answer * b
                problem_text = f"{a} ÷ {b}"
        
        return Problem(
            problem=problem_text,
            answer=answer,
            difficulty=difficulty,
            operation_type=operation_type
        )
    
    @classmethod
    def calculate_xp(cls, score: int, total_problems: int, difficulty: DifficultyLevel) -> int:
        base_xp = score * 10
        difficulty_multiplier = {
            DifficultyLevel.EASY: 1.0,
            DifficultyLevel.MEDIUM: 1.5,
            DifficultyLevel.HARD: 2.0
        }
        
        accuracy_bonus = 0
        if total_problems > 0:
            accuracy = score / total_problems
            if accuracy >= 0.9:
                accuracy_bonus = score * 5
            elif accuracy >= 0.75:
                accuracy_bonus = score * 3
        
        return int((base_xp * difficulty_multiplier[difficulty]) + accuracy_bonus)
    
    @classmethod
    def get_ninja_belt(cls, xp: int) -> str:
        thresholds = [0, 100, 300, 600, 1000, 1500]
        for i, threshold in enumerate(thresholds):
            if xp < threshold:
                return cls.NINJA_BELTS[max(0, i-1)]
        return cls.NINJA_BELTS[-1]
    
    @classmethod
    def get_level(cls, xp: int) -> int:
        return max(1, xp // 50 + 1)