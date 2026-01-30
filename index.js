let user = 0,
  comp = 0,
  active = true;
let mode = 3;
let totalRounds = 3;
let roundsPlayed = 0;
let historyList = [];

const rules = {
  rock: { beats: ["scissors", "lizard"], verb: "crushes" },
  paper: { beats: ["rock", "spock"], verb: "covers" },
  scissors: { beats: ["paper", "lizard"], verb: "cuts" },
  lizard: { beats: ["spock", "paper"], verb: "poisons" },
  spock: { beats: ["scissors", "rock"], verb: "smashes" },
};

const els = {
  uScore: document.getElementById("uScore"),
  cScore: document.getElementById("cScore"),
  roundInfo: document.getElementById("roundInfo"),
  mainResult: document.getElementById("mainResult"),
  subResult: document.getElementById("subResult"),
  reset: document.getElementById("reset"),
  history: document.getElementById("history"),
  choices: document.querySelectorAll(".choice-btn"),
  body: document.body,
  modal: document.getElementById("rulesModal"),
};

/* --- GAME LOGIC --- */
els.choices.forEach((btn) => {
  btn.onclick = () => play(btn.dataset.move);
});

function play(userMove) {
  if (!active) return;

  const compMove = aiMove();
  let result, verb;

  if (userMove === compMove) {
    result = "Draw";
    verb = "matches";
  } else if (rules[userMove].beats.includes(compMove)) {
    user++;
    result = "Win";
    verb = rules[userMove].verb;
  } else {
    comp++;
    result = "Lose";
    verb = rules[compMove].verb;
  }

  roundsPlayed++;
  updateUI(userMove, compMove, result, verb);
  checkEnd();
}

function aiMove() {
  let opts = ["rock", "paper", "scissors"];
  if (mode === 5) opts.push("lizard", "spock");
  return opts[Math.floor(Math.random() * opts.length)];
}

function updateUI(u, c, r, v) {
  els.uScore.innerText = user;
  els.cScore.innerText = comp;
  els.roundInfo.innerText = `${roundsPlayed} / ${totalRounds}`;

  els.mainResult.innerText = r === "Draw" ? "Draw!" : `You ${r}!`;
  els.mainResult.className = `result-title text-${r.toLowerCase()}`;

  const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);

  const formatMove = (m) => {
    if (m === "rock") return "✊";
    if (m === "paper") return "✋";
    if (m === "scissors") return "✂️";
    if (m === "lizard") return "🦎";
    if (m === "spock") return "🖖";
    return m;
  };

  els.subResult.innerText = `${formatMove(u)} ${v} ${formatMove(c)}`;

  historyList.unshift({ u, c, r });
  if (historyList.length > 5) historyList.pop();

  els.history.innerHTML = historyList
    .map(
      (h) =>
        `<li class="history-item">
            <span><span class="status-box status-${h.r}"></span>${formatMove(h.u)} vs ${formatMove(h.c)}</span>
            <span class="text-${h.r.toLowerCase()}">${h.r.toUpperCase()}</span>
        </li>`,
    )
    .join("");
}

function checkEnd() {
  if (roundsPlayed >= totalRounds) {
    active = false;
    els.choices.forEach((b) => (b.disabled = true));
    els.reset.style.display = "block";

    if (user > comp) {
      els.body.classList.add("series-won");
      els.mainResult.innerText = "🏆 SERIES WON";
      els.subResult.innerText = `Final Score: ${user} - ${comp}`;
    } else if (comp > user) {
      els.body.classList.add("series-lost");
      els.mainResult.innerText = "💀 SERIES LOST";
      els.subResult.innerText = `Final Score: ${user} - ${comp}`;
    } else {
      els.body.classList.add("series-draw");
      els.mainResult.innerText = "🤝 SERIES DRAW";
      els.subResult.innerText = `Final Score: ${user} - ${comp}`;
    }
  }
}

/* --- RESET & SETTINGS --- */
function resetGame() {
  user = 0;
  comp = 0;
  roundsPlayed = 0;
  active = true;
  historyList = [];

  els.uScore.innerText = "0";
  els.cScore.innerText = "0";
  els.roundInfo.innerText = `0 / ${totalRounds}`;

  els.mainResult.innerText = "Ready";
  els.mainResult.className = "result-title";
  els.subResult.innerText = "Select a weapon";

  els.reset.style.display = "none";
  els.history.innerHTML =
    '<li style="color:#cbd5e1; font-style:italic;">No moves yet...</li>';
  els.choices.forEach((b) => (b.disabled = false));
  els.body.className = "";
}

window.setMode = (m) => {
  mode = m;
  setActive("m", m);
  const extras = document.querySelectorAll(
    '[data-move="lizard"],[data-move="spock"]',
  );
  extras.forEach((b) => b.classList.toggle("hidden", m === 3));
  resetGame();
};

window.setSeries = (s) => {
  totalRounds = s;
  setActive("s", s);
  resetGame();
};

function setActive(prefix, val) {
  document
    .querySelectorAll(`.toggle-btn[id^="${prefix}"]`)
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(prefix + val).classList.add("active");
}

/* --- MODAL --- */
window.toggleRules = () => els.modal.classList.toggle("open");
els.modal.addEventListener("click", (e) => {
  if (e.target === els.modal) toggleRules();
});
