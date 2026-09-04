import pytest

from app.models.game import DifficultyLevel, OperationType
from app.services.game_logic import GameLogic

N = 200  # iterations for randomized invariant checks


@pytest.mark.parametrize("difficulty", list(DifficultyLevel))
def test_generate_problem_addition_subtraction_invariants(difficulty):
    max_num = GameLogic.DIFFICULTY_RANGES[difficulty]
    for _ in range(N):
        problem = GameLogic.generate_problem(difficulty, OperationType.ADDITION_SUBTRACTION)
        assert problem.difficulty == difficulty
        assert problem.operation_type == OperationType.ADDITION_SUBTRACTION
        if "+" in problem.problem:
            a, b = (int(x) for x in problem.problem.split(" + "))
            assert 1 <= a <= max_num
            assert 1 <= b <= max_num
            assert problem.answer == a + b
        else:
            a, b = (int(x) for x in problem.problem.split(" - "))
            assert 1 <= a <= max_num
            assert 1 <= b <= max_num
            assert a >= b  # subtraction never negative
            assert problem.answer == a - b
            assert problem.answer >= 0


@pytest.mark.parametrize("difficulty", list(DifficultyLevel))
def test_generate_problem_multiplication_division_invariants(difficulty):
    max_num = GameLogic.DIFFICULTY_RANGES[difficulty]
    cap = min(max_num, 12)
    for _ in range(N):
        problem = GameLogic.generate_problem(difficulty, OperationType.MULTIPLICATION_DIVISION)
        assert problem.difficulty == difficulty
        assert problem.operation_type == OperationType.MULTIPLICATION_DIVISION
        if "×" in problem.problem:
            a, b = (int(x) for x in problem.problem.split(" × "))
            assert 1 <= a <= cap
            assert 1 <= b <= cap
            assert problem.answer == a * b
        else:
            a, b = (int(x) for x in problem.problem.split(" ÷ "))
            assert 2 <= b <= cap
            assert 1 <= problem.answer <= max_num
            assert a == problem.answer * b  # division always exact


@pytest.mark.parametrize(
    "score,total_problems,difficulty,expected",
    [
        (10, 10, DifficultyLevel.EASY, int(10 * 10 * 1.0 + 10 * 5)),  # accuracy == 1.0 (>= 0.9)
        (9, 10, DifficultyLevel.MEDIUM, int(9 * 10 * 1.5 + 9 * 5)),  # accuracy == 0.9 exactly
        (89, 100, DifficultyLevel.EASY, int(89 * 10 * 1.0 + 89 * 3)),  # accuracy 0.89 < 0.9 -> lower bonus
        (75, 100, DifficultyLevel.HARD, int(75 * 10 * 2.0 + 75 * 3)),  # accuracy == 0.75 exactly
        (74, 100, DifficultyLevel.EASY, int(74 * 10 * 1.0)),  # accuracy 0.74 < 0.75 -> no bonus
        (0, 0, DifficultyLevel.EASY, 0),  # zero total_problems
    ],
)
def test_calculate_xp(score, total_problems, difficulty, expected):
    assert GameLogic.calculate_xp(score, total_problems, difficulty) == expected


@pytest.mark.parametrize(
    "xp,expected_belt",
    [
        (0, "white"),
        (99, "white"),
        (100, "yellow"),
        (299, "yellow"),
        (300, "green"),
        (599, "green"),
        (600, "brown"),
        (999, "brown"),
        (1000, "black"),
        (1499, "black"),
        (1500, "master"),
        (10000, "master"),
    ],
)
def test_get_ninja_belt_boundaries(xp, expected_belt):
    assert GameLogic.get_ninja_belt(xp) == expected_belt


@pytest.mark.parametrize(
    "xp,expected_level",
    [
        (0, 1),
        (49, 1),
        (50, 2),
        (99, 2),
        (100, 3),
    ],
)
def test_get_level_boundaries(xp, expected_level):
    assert GameLogic.get_level(xp) == expected_level
