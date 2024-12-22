import random

# Load words from a file, ensuring valid input or using fallback words if needed
def load_words_from_file(filename): 
    try:
        # Read and clean words from the file
        with open(filename, "r") as file:
            words = [line.strip().upper() for line in file.readlines()]
        if not words:  # If the file is empty, raise an error
            raise ValueError("The word list is empty.")
        return words
    except FileNotFoundError:  # Handle missing file error
        print("Word list file not found. Please ensure 'words.txt' exists.")
        return ["PYTHON", "PROGRAMMING", "DEVELOPER"]  # Fallback words
    except ValueError as e:  # Handle other errors like an empty file
        print(e)
        return ["PYTHON", "PROGRAMMING", "DEVELOPER"]  # Fallback words

# Display the hangman stage based on the number of incorrect guesses left
def display_hangman(tries): 
    stages = [
        # Final stage: full hangman
        """
           ------
           |    |
           O    |
          /|\   |
          / \   |
                |
        """,
        # Losing stages
        """
           ------
           |    |
           O    |
          /|\   |
          /     |
                |
        """,
        """
           ------
           |    |
           O    |
          /|\   |
                |
                |
        """,
        """
           ------
           |    |
           O    |
          /|    |
                |
                |
        """,
        """
           ------
           |    |
           O    |
           |    |
                |
                |
        """,
        """
           ------
           |    |
           O    |
                |
                |
                |
        """,
        # Initial stage: no incorrect guesses
        """
           ------
           |    |
                |
                |
                |
                |
        """
    ]
    return stages[tries]

# Calculate score based on tries left and the difficulty multiplier
def calculate_score(tries_left, max_tries):
    if max_tries == 6:  # Default difficulty
        multiplier = 10
    elif max_tries == 4:  # Challenge mode
        multiplier = 15
    return tries_left * multiplier

# Ask the user if they want to opt into a challenge mode
def ask_for_challenge():
    attempts = 0  # Track invalid attempts
    while attempts < 3:  # Allow 2 invalid attempts before forcing challenge mode
        choice = input("Do you want to opt into the challenge? (Y/N): ").strip().upper()
        if choice == "Y":  # User chooses challenge mode
            print("\nYou opted for the challenge! You will only have 4 tries.\n")
            return 4
        elif choice == "N":  # User opts out of challenge mode
            print("\nYou chose not to take the challenge. You will have 6 tries.\n")
            return 6
        else:  # Handle invalid input
            print("Invalid choice. Please answer with 'Y' or 'N'.")
            attempts += 1
    # Force challenge mode after 2 invalid attempts
    print("Too many invalid choices. Forcing you into the challenge mode with 4 tries.")
    return 4

# Main logic for a single hangman game
def hangman_game(word, max_tries):
    word_completion = "_" * len(word)  # Initialize the word with underscores
    guessed = False  # Flag for whether the word has been guessed
    guessed_letters = []  # Track guessed letters
    guessed_words = []  # Track guessed words
    tries = max_tries  # Start with the maximum allowed tries
    invalid_guesses = 0  # Track invalid guesses
    repeated_guesses = 0  # Track repeated guesses

    print(f"The word has {len(word)} letters.")  # Display word length
    print(display_hangman(tries))  # Display initial hangman stage
    print(word_completion)

    while not guessed and tries > 0:  # Continue until word is guessed or tries run out
        vowels = [letter for letter in guessed_letters if letter in "AEIOU"]
        consonants = [letter for letter in guessed_letters if letter not in "AEIOU"]
        print(f"Guessed vowels: {', '.join(sorted(vowels)) if vowels else 'None'}") # Separate guessed letters into vowels sorted alphabetically
        print(f"Guessed consonants: {', '.join(sorted(consonants)) if consonants else 'None'}") # Separate guessed letters into consonants sorted alphabetically
        print(f"Guessed words: {', '.join(sorted(guessed_words)) if guessed_words else 'None'}") # Sort guessed words alphabetically
        guess = input("Please guess a letter or word: ").upper()  # Get user's guess
        if len(guess) == 1 and guess.isalpha():  # Single letter guess
            if guess in guessed_letters:  # Check if letter was already guessed
                print(f"You already guessed the letter {guess}.")
                repeated_guesses += 1 # Increment repeated guesses
                if repeated_guesses == 3:
                    print("Too many repeated guesses. You lose a try.")
                    tries -= 1
            elif guess not in word:  # Incorrect letter guess
                print(f"{guess} is not in the word.")
                tries -= 1  # Decrement tries
                guessed_letters.append(guess)  # Add to guessed letters
            else:  # Correct letter guess
                print(f"Good job! {guess} is in the word!")
                guessed_letters.append(guess)
                word_as_list = list(word_completion)  # Convert word to a list
                # Update the word completion with the correct letter
                indices = [i for i, letter in enumerate(word) if letter == guess]
                for index in indices:
                    word_as_list[index] = guess
                word_completion = "".join(word_as_list)  # Rebuild the word
                if "_" not in word_completion:  # Check if the word is fully guessed
                    guessed = True
        elif len(guess) == len(word) and guess.isalpha():  # Whole word guess
            if guess in guessed_words:  # Check if word was already guessed
                print(f"You already guessed the word {guess}.")
                repeated_guesses += 1 # Increment repeated guesses
                if repeated_guesses == 3:
                    print("Too many repeated guesses. You lose a try.")
                    tries -= 1
            elif guess != word:  # Incorrect word guess
                print(f"{guess} is not the word.")
                tries -= 1  # Decrement tries
                guessed_words.append(guess)  # Add to guessed words
            else:  # Correct word guess
                guessed = True
                word_completion = word
        else:  # Invalid guess input
            print("Invalid guess.")
            invalid_guesses += 1
            if invalid_guesses == 3:
                print("Too many invalid guesses. You lose a try.")
                tries -= 1
        # Display the updated hangman stage and word completion
        print(display_hangman(tries))
        print(word_completion)

    # End of game messages
    if guessed:
        print(f"Congratulations! You guessed the word {word}!")
    else:
        print(f"Sorry, you ran out of tries. The word was {word}. Better luck next time!")

    return tries  # Return the number of tries left

# Main program execution
def main():
    word_list = load_words_from_file("words.txt")  # Load words from file
    max_tries = ask_for_challenge()  # Determine difficulty level
    cumulative_score = 0  # Track the cumulative score across all games
    for game_number in range(1, 6):  # Play 5 games
        print(f"\nGame {game_number}/5")
        word = random.choice(word_list)  # Select a random word
        tries_left = hangman_game(word, max_tries)  # Play the game
        game_score = calculate_score(tries_left, max_tries)  # Calculate score
        print(f"Score for this game: {game_score}")
        cumulative_score += game_score  # Add to cumulative score

    # Display session summary
    print("\n--- Session Summary ---")
    print(f"Max Tries Per Game: {max_tries}")
    print(f"Total Score: {cumulative_score}")
    print("Thanks for playing! Goodbye!")

# Run the program
if __name__ == "__main__":
    main()