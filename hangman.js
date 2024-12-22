// Hangman stages (visuals)
const hangmanStages = [
  `
   ------
   |    |
   O    |
  /|\\   |
  / \\   |
        |
  `,
  `
   ------
   |    |
   O    |
  /|\\   |
  /     |
        |
  `,
  `
   ------
   |    |
   O    |
  /|\\   |
        |
        |
  `,
  `
   ------
   |    |
   O    |
  /|    |
        |
        |
  `,
  `
   ------
   |    |
   O    |
   |    |
        |
        |
  `,
  `
   ------
   |    |
   O    |
        |
        |
        |
  `,
  `
   ------
   |    |
        |
        |
        |
        |
  `,
];

// Word list for the game
const wordList = ["PYTHON", "JAVASCRIPT", "HANGMAN", "PROGRAMMING", "DEVELOPER", 
  "ELEPHANT", "GIRAFFE", "KANGAROO", "DOLPHIN", "CROCODILE", "PENGUIN", "ZEBRA",
  "CARPENTER", "TEACHER", "DOCTOR", "NURSE", "SCIENTIST", "ENGINEER", 
  "MOUNTAIN", "VALLEY", "FOREST", "OCEAN", "ISLAND", "DESERT", "RIVER", "WATERFALL", 
  "UMBRELLA", "LANTERN", "NOTEBOOK", "BICYCLE", "GUITAR", "CAMERA", "BALLOON", 
  "RAINBOW", "THUNDER", "SUNSHINE", "SNOWFLAKE", "CLOUD", 
  "KINGDOM", "CASTLE", "VILLAGE", "TOWER", "BRIDGE", "PALACE", "CATHEDRAL", 
  "BASEBALL", "SOCCER", "TENNIS", "CRICKET", "HOCKEY", "BASKETBALL", 
  "GALAXY", "PLANET", "ASTEROID", "METEOR", "COMET", "BLACKHOLE", "SUPERNOVA", 
  "BUTTERFLY", "CATERPILLAR", "FIREFLY", "GRASSHOPPER", "LADYBUG", 
  "PEACOCK", "PARROT", "EAGLE", "FALCON", "SPARROW", "FLAMINGO", 
  "SPAGHETTI", "HAMBURGER", "PIZZA", "TACOS", "SUSHI", "PASTA", "CROISSANT", 
  "HARMONY", "MELODY", "RHYTHM", "SYMPHONY", "CHORD", 
  "PYRAMID", "SPHINX", "STATUE", "MONUMENT", "RUINS", "TEMPLE", 
  "PUZZLE", "RIDDLE", "MYSTERY", "ENIGMA", "LABYRINTH" 
  ];

// Game variables
let word = ""; // The word to guess
let displayWord = ""; // Displayed word with underscores
let triesLeft = 6; // Number of tries left
let guessedVowels = []; // List of guessed vowels
let guessedConsonants = []; // List of guessed consonants
let guessedWords = []; // List of guessed words

// Cache DOM elements
const hangmanElement = document.getElementById("hangman");
const wordElement = document.getElementById("word");
const guessedVowelsElement = document.getElementById("guessedVowels");
const guessedConsonantsElement = document.getElementById("guessedConsonants");
const guessedWordsElement = document.getElementById("guessedWords");
const messageElement = document.getElementById("message");
const playAgainButton = document.getElementById("playAgainButton");
const guessInput = document.getElementById("guessInput");

// Add event listener for Enter key to submit guess
guessInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    makeGuess();
  }
});

// Initialize a new game
function startNewGame() {
  word = wordList[Math.floor(Math.random() * wordList.length)]; // Random word
  displayWord = "_ ".repeat(word.length).trim(); // Initialize display word
  triesLeft = 6;
  guessedVowels = [];
  guessedConsonants = [];
  guessedWords = [];
  updateDisplay();
  messageElement.textContent = ""; // Clear messages
  playAgainButton.style.display = "none"; // Hide Play Again button
  guessInput.disabled = false; // Enable input
  guessInput.value = ""; // Clear input
  guessInput.focus();
}

// Update the game display
function updateDisplay() {
  // Update hangman visualization
  hangmanElement.textContent = hangmanStages[triesLeft];
  // Update displayed word
  wordElement.textContent = displayWord;
  // Update guessed vowels and consonants
  guessedVowelsElement.innerHTML = `Guessed Vowels: ${
    guessedVowels.length > 0 ? guessedVowels.sort().join(", ") : "None"
  }`;
  guessedConsonantsElement.innerHTML = `Guessed Consonants: ${
    guessedConsonants.length > 0 ? guessedConsonants.sort().join(", ") : "None"
  }`;
  guessedWordsElement.innerHTML = `Guessed Words: ${
    guessedWords.length > 0 ? guessedWords.sort().join(", ") : "None"
  }`;
}

// Handle user guesses
function makeGuess() {
  const guess = guessInput.value.trim().toUpperCase();
  guessInput.value = ""; // Clear input field
  if (!guess) {
    messageElement.textContent = "Please enter a letter or word.";
    messageElement.className = "error";
    return;
  }

  // Handle single letter guesses
  if (guess.length === 1) {
    if (guess < "A" || guess > "Z") {
      messageElement.textContent = "That is an invalid guess. Please enter a letter or word.";
      speakWord("That is an invalid guess. Please enter a letter or word.");
      messageElement.className = "error";
      return;
    }
    if (guessedVowels.includes(guess) || guessedConsonants.includes(guess)) {
      messageElement.textContent = `You already guessed the letter "${guess}".`;
      speakWord("You already guessed the letter " + guess);
      messageElement.className = "error";
      return;
    }
    if (word.includes(guess)) {
      messageElement.textContent = `Good job! "${guess}" is in the word.`;
      speakWord("Good job! " + guess + " is in the word.");
      messageElement.className = "";
      if ("AEIOU".includes(guess)) guessedVowels.push(guess);
      else guessedConsonants.push(guess);
      updateDisplayWord(guess);
    } else {
      messageElement.textContent = `Sorry, "${guess}" is not in the word.`;
      speakWord("Sorry, " + guess + " is not in the word.");
      messageElement.className = "error";
      triesLeft--;
      if ("AEIOU".includes(guess)) guessedVowels.push(guess);
      else guessedConsonants.push(guess);
    }
  } else {
    // Handle word guesses
    if (guessedWords.includes(guess)) {
      messageElement.textContent = `You already guessed the word "${guess}".`;
      speakWord("You already guessed the word " + guess);
      messageElement.className = "error";
      return;
    }
    guessedWords.push(guess);
    if (guess === word) {
      messageElement.textContent = "Congratulations! You guessed the word!";
      speakWord("Congratulations! You guessed the word " + guess);
      messageElement.className = "";
      displayWord = guess;
    } else {
      messageElement.textContent = `Sorry, "${guess}" is not the word.`;
      speakWord("Sorry, " + guess + " is not the word.");
      messageElement.className = "error";
      triesLeft--;
    }
  }
  updateDisplay();
  checkGameOver();
}

function speakWord(msg) {
  if (msg == null) {
    return;
  }
  var speech = new SpeechSynthesisUtterance(msg);
  speech.lang = 'en-GB';
  var voices = window.speechSynthesis.getVoices();
  speech.default = false;
  speech.voice = voices.filter(function(voice) {
    return voice.name == 'Google UK English Male';
  })[0];
  window.speechSynthesis.speak(speech);
}

// Update the displayed word
function updateDisplayWord(letter) {
  let newDisplay = "";
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter || displayWord[i * 2] !== "_") {
      newDisplay += word[i] + " ";
    } else {
      newDisplay += "_ ";
    }
  }
  displayWord = newDisplay.trim();
}

// Check if the game is over
function checkGameOver() {
  if (!displayWord.includes("_")) {
    messageElement.textContent = "You win! Great job!";
    speakWord("You win! Great job!");
    messageElement.className = "";
    endGame(true);
  } else if (triesLeft <= 0) {
    messageElement.textContent = `Game over! The word was "${word}".`;
    speakWord("Game over! The word was " + word);
    messageElement.className = "error";
    endGame(false);
  }
}

// End the game
function endGame(won) {
  playAgainButton.style.display = "block"; // Show Play Again button
  guessInput.disabled = true; // Disable input
  speakWord("Click the Play Again button to start a new game.");
}

// Start the game on page load
startNewGame();