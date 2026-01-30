let userScore = 0;
let compScore = 0;
let gameActive = true;
const winningScore = 3;

const userScoreSpan = document.getElementById("user-score");
const compScoreSpan = document.getElementById("comp-score");
const resultText = document.getElementById("result-text");
const resetBtn = document.getElementById("reset-btn");
const modal = document.getElementById("rulesModal");
const buttons = document.querySelectorAll(".choice-btn");
const body = document.body;

const rules = {
  rock: { beats: ["scissors", "lizard"] },
  paper: { beats: ["rock", "spock"] },
  scissors: { beats: ["paper", "lizard"] },
  lizard: { beats: ["spock", "paper"] },
  spock: { beats: ["scissors", "rock"] },
};

function closeModal() {
  modal.style.display = "none";
}

function getComputerChoice() {
  const choices = Object.keys(rules);
  return choices[Math.floor(Math.random() * choices.length)];
}

function playGame(userChoice) {
  if (!gameActive) return;

  const compChoice = getComputerChoice();

  if (userChoice === compChoice) {
    updateDisplay("Draw", userChoice, compChoice);
  } else if (rules[userChoice].beats.includes(compChoice)) {
    userScore++;
    userScoreSpan.innerText = userScore;
    updateDisplay("Win", userChoice, compChoice);
  } else {
    compScore++;
    compScoreSpan.innerText = compScore;
    updateDisplay("Lose", userChoice, compChoice);
  }

  checkGameOver();
}

function updateDisplay(result, user, comp) {
  if (result === "Win") {
    resultText.innerHTML = `${capitalize(user)} beats ${capitalize(comp)}.<br>You Win Round!`;
  } else if (result === "Lose") {
    resultText.innerHTML = `${capitalize(comp)} beats ${capitalize(user)}.<br>You Lose Round.`;
  } else {
    resultText.innerHTML = `Both chose ${capitalize(user)}.<br>Draw.`;
  }
}

function checkGameOver() {
  if (userScore === winningScore || compScore === winningScore) {
    gameActive = false;
    disableButtons();

    if (userScore > compScore) {
      body.classList.add("series-won");
      resultText.innerHTML = `<span style="font-size: 1.5rem">🏆 SERIES VICTORY!</span>`;
    } else {
      body.classList.add("series-lost");
      resultText.innerHTML = `<span style="font-size: 1.5rem">💀 SERIES LOST</span>`;
    }
    resetBtn.style.display = "block";
  }
}

function disableButtons() {
  buttons.forEach((btn) => (btn.disabled = true));
}

function resetGame() {
  userScore = 0;
  compScore = 0;
  gameActive = true;
  userScoreSpan.innerText = 0;
  compScoreSpan.innerText = 0;
  resultText.innerText = "Make your move";
  resetBtn.style.display = "none";
  buttons.forEach((btn) => (btn.disabled = false));

  body.classList.remove("series-won", "series-lost");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
