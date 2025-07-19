#!/usr/bin/env python3
"""
Math Practice Game for Kids
A 2-minute timed math practice game with scoring
"""

import random
import time
import sys

def clear_screen():
    """Clear the terminal screen"""
    print("\033[2J\033[H", end="")

def get_difficulty():
    """Get difficulty level from user"""
    print("Choose difficulty level:")
    print("1. Easy (numbers 1-10)")
    print("2. Medium (numbers 1-20)")  
    print("3. Hard (numbers 1-50)")
    
    while True:
        try:
            choice = int(input("Enter choice (1-3): "))
            if choice == 1:
                return 10
            elif choice == 2:
                return 20
            elif choice == 3:
                return 50
            else:
                print("Please enter 1, 2, or 3")
        except ValueError:
            print("Please enter a valid number")

def get_operation_type():
    """Get operation type from user"""
    print("\nChoose operation type:")
    print("1. Addition & Subtraction")
    print("2. Multiplication & Division")
    
    while True:
        try:
            choice = int(input("Enter choice (1-2): "))
            if choice in [1, 2]:
                return choice
            else:
                print("Please enter 1 or 2")
        except ValueError:
            print("Please enter a valid number")

def generate_problem(max_num, op_type):
    """Generate a math problem based on difficulty and operation type"""
    if op_type == 1:  # Addition & Subtraction
        operation = random.choice(['+', '-'])
        a = random.randint(1, max_num)
        b = random.randint(1, max_num)
        
        if operation == '+':
            answer = a + b
        else:  # subtraction
            # Ensure positive result
            if a < b:
                a, b = b, a
            answer = a - b
            
    else:  # Multiplication & Division
        operation = random.choice(['×', '÷'])
        
        if operation == '×':
            # Keep multiplication reasonable
            a = random.randint(1, min(max_num, 12))
            b = random.randint(1, min(max_num, 12))
            answer = a * b
        else:  # division
            # Generate division that results in whole numbers
            answer = random.randint(1, max_num)
            b = random.randint(2, min(max_num, 12))
            a = answer * b  # This ensures whole number division
            
    return f"{a} {operation} {b}", answer

def play_round(max_num, op_type):
    """Play one 2-minute round"""
    print(f"\n🎯 ROUND START! You have 2 minutes!")
    print("Type your answer and press Enter. Type 'quit' to stop early.\n")
    
    start_time = time.time()
    score = 0
    problems_attempted = 0
    
    while time.time() - start_time < 120:  # 2 minutes = 120 seconds
        remaining_time = int(120 - (time.time() - start_time))
        
        problem, correct_answer = generate_problem(max_num, op_type)
        
        print(f"⏰ {remaining_time}s left | Score: {score} | Problem {problems_attempted + 1}")
        print(f"{problem} = ", end="")
        
        try:
            user_input = input().strip()
            
            if user_input.lower() == 'quit':
                break
                
            user_answer = int(user_input)
            problems_attempted += 1
            
            if user_answer == correct_answer:
                print("✅ Correct!")
                score += 1
            else:
                print(f"❌ Wrong! The answer was {correct_answer}")
                
        except ValueError:
            print("Please enter a valid number or 'quit'")
            continue
        except KeyboardInterrupt:
            break
            
        print()  # Empty line for readability
    
    return score, problems_attempted

def show_results(score, attempted):
    """Display round results"""
    print("\n" + "="*50)
    print("🏁 ROUND FINISHED!")
    print("="*50)
    print(f"Problems attempted: {attempted}")
    print(f"Correct answers: {score}")
    
    if attempted > 0:
        accuracy = (score / attempted) * 100
        print(f"Accuracy: {accuracy:.1f}%")
        
        if accuracy >= 90:
            print("🌟 Excellent work!")
        elif accuracy >= 75:
            print("👍 Great job!")
        elif accuracy >= 60:
            print("👌 Good effort!")
        else:
            print("💪 Keep practicing!")
    
    print(f"Speed: {score} correct answers in 2 minutes")
    print("="*50)

def main():
    """Main game loop"""
    print("🧮 MATH PRACTICE GAME 🧮")
    print("Welcome! Let's practice math for 2 minutes!")
    
    total_rounds = 0
    total_score = 0
    
    while True:
        clear_screen()
        print("🧮 MATH PRACTICE GAME 🧮\n")
        
        if total_rounds > 0:
            avg_score = total_score / total_rounds
            print(f"📊 Stats: {total_rounds} rounds played, average score: {avg_score:.1f}")
            print()
        
        max_num = get_difficulty()
        op_type = get_operation_type()
        
        input("\nPress Enter when ready to start the 2-minute timer...")
        
        score, attempted = play_round(max_num, op_type)
        show_results(score, attempted)
        
        total_rounds += 1
        total_score += score
        
        play_again = input("\nWould you like to play another round? (y/n): ").lower()
        if play_again not in ['y', 'yes']:
            break
    
    print(f"\n🎉 Thanks for playing! You completed {total_rounds} rounds!")
    print(f"Total correct answers: {total_score}")
    if total_rounds > 0:
        print(f"Average score per round: {total_score/total_rounds:.1f}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye! Keep practicing!")
        sys.exit(0)