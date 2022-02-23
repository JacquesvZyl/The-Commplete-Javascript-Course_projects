const guessedNumber = document.querySelector(".answer input");
const checkBtn = document.querySelector(".answer button");
const resultOutput = document.querySelector(".scores h2");
const scoreDisplay = document.querySelector(".score span");
const answerDisplay = document.querySelector(".answer-container p");
const highScoreDisplay = document.querySelector(".high-score span");
const againBtn = document.querySelector("header button");
let numToGuess = returnRandNum(20);
let highScore = 0;
let currentScore = 20;

function returnRandNum(max) {
  return Math.floor(Math.random() * max) + 1;
}

function checkHighScore() {
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreDisplay.innerText = highScore;
  }
}

function setCurrentScore() {
  currentScore--;

  if (currentScore <= 0) {
    currentScore = 0;
    document.querySelector(".guess-section h1").innerText = "Game over!";
  }
  scoreDisplay.innerText = currentScore;
}

function resetGame() {
  currentScore = 20;
  scoreDisplay.innerText = currentScore;
  document.querySelector("body").style.backgroundColor = "#201f20";
  resultOutput.innerText = "Start Guessing...";
  answerDisplay.innerText = "?";
  guessedNumber.value = "";
  numToGuess = returnRandNum(20);
}

function CheckResult(value) {
  if (!value) {
    resultOutput.innerText = "🛑 No Number!";
  } else if (value === numToGuess) {
    answerDisplay.innerText = numToGuess;
    resultOutput.innerText = "🥳 Correct number!";
    checkHighScore();
    document.querySelector("body").style.backgroundColor = "green";
  } else if (value < numToGuess) {
    resultOutput.innerText = "📉 Too Low!";
    setCurrentScore();
  } else {
    resultOutput.innerText = "📈 Too High!";
    setCurrentScore();
  }
}

checkBtn.addEventListener("click", () => {
  CheckResult(Number(guessedNumber.value));
  console.log(guessedNumber.value);
  console.log(numToGuess);
});

againBtn.addEventListener("click", () => {
  resetGame();
});
