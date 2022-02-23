'use strict';

const diceImg = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const bothPlayers = document.querySelectorAll('.player');

const data = {
  name: 'jacques',
  surname: 'vanZyl',
  birthDate: 1999,
  currentYear: 2022,
  age: function () {
    return this.currentYear - this.birthDate;
  },
  isOld: function () {
    return this.age() > 30;
  },
};
console.dir(diceImg);

function randNum() {
  return Math.floor(Math.random() * 6 + 1);
}

function switchPlayer() {
  bothPlayers.forEach(player => player.classList.toggle('player--active'));
}

function gameLoop() {
  const activePlayerCurrent = document.querySelector(
    '.player--active .current-score'
  );
  const rolledNum = randNum();
  diceImg.src = `/images/dice-${rolledNum}.png`;

  if (rolledNum > 1) {
    let playerCurrentScore = Number(activePlayerCurrent.innerText);
    playerCurrentScore += rolledNum;
    activePlayerCurrent.innerText = playerCurrentScore;
  } else {
    activePlayerCurrent.innerText = 0;
    switchPlayer();
  }
}

function hold() {
  const activePlayerScore = document.querySelector('.player--active .score');
  const activePlayerCurrent = document.querySelector(
    '.player--active .current-score'
  );
  const total =
    Number(activePlayerCurrent.innerText) + Number(activePlayerScore.innerText);
  activePlayerScore.innerText = total;
  activePlayerCurrent.innerText = 0;
}

function checkWinner() {
  const activePlayer = document.querySelector('.player--active');
  const activePlayerScore = activePlayer.querySelector('.score');

  if (Number(activePlayerScore.innerText) >= 100) {
    activePlayer.classList.toggle('player--winner');
    btnHold.disabled = true;
    btnRoll.disabled = true;
  } else {
    switchPlayer();
  }
}

function resetGame() {
  bothPlayers.forEach((player, i) => {
    if (i === 0) {
      if (!player.classList.contains('player--active'))
        player.classList.add('player--active');
    } else {
      player.classList.remove('player--active');
    }
    player.querySelector('.score').innerText = 0;
    player.querySelector('.current-score').innerText = 0;
    player.classList.remove('player--winner');
  });
  btnHold.disabled = false;
  btnRoll.disabled = false;
}

btnRoll.addEventListener('click', gameLoop);

btnHold.addEventListener('click', () => {
  hold();
  checkWinner();
});

btnNew.addEventListener('click', resetGame);
