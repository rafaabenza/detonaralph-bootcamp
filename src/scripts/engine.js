const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    startButton: document.querySelector("#start-game"),
    modal: document.querySelector("#game-over-modal"),
    finalScore: document.querySelector("#final-score"),
  },
  values: {
    timerId: null,
    gameTimerId: null,
    gameTime: 45,
    gameVelocity: 1000,
    hitPosition: null,
    result: 0,
    lives: 3,
  },
};

// Função para movimentar o inimigo aleatoriamente entre os quadrados
function randomSquare() {
  state.view.squares.forEach((square) => square.classList.remove("enemy"));
  const randomSquare = state.view.squares[Math.floor(Math.random() * state.view.squares.length)];
  randomSquare.classList.add("enemy");

  state.values.hitPosition = randomSquare.id;
}

// Função para mover o inimigo continuamente
function moveEnemy() {
  state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

// Adiciona cliques nas quadrados e verifica se o inimigo foi atingido ou se houve erro
function addClickListeners() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        // Acertou o inimigo
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit"); // Reproduz som de acerto
      } else {
        // Errou e perdeu uma vida
        state.values.lives--;
        state.view.lives.textContent = `x${state.values.lives}`;
        playSound("miss"); // Reproduz som de erro
        if (state.values.lives <= 0) {
          endGame(); // Finaliza o jogo se todas as vidas acabarem
        }
      }
    });
  });
}

// Função para iniciar o jogo
function startGame() {
  // Resetando valores iniciais
  state.values.result = 0;
  state.values.lives = 3;
  state.values.gameTime = 45;

  state.view.score.textContent = state.values.result;
  state.view.lives.textContent = `x${state.values.lives}`;
  state.view.timeLeft.textContent = state.values.gameTime;

  state.view.modal.classList.add("hidden"); // Esconde o modal de Game Over

  moveEnemy(); // Começa o movimento do inimigo

  // Temporizador do jogo (contagem regressiva do tempo)
  state.values.gameTimerId = setInterval(() => {
    state.values.gameTime--;
    state.view.timeLeft.textContent = state.values.gameTime;

    if (state.values.gameTime <= 0) {
      endGame(); // Finaliza o jogo se o tempo acabar
    }
  }, 1000);
}

// Função para encerrar o jogo
function endGame() {
  clearInterval(state.values.timerId); // Para o movimento do inimigo
  clearInterval(state.values.gameTimerId); // Para o temporizador do jogo

  // Exibe o modal de fim de jogo com a pontuação final
  state.view.finalScore.textContent = `Pontuação final: ${state.values.result}`;
  state.view.modal.classList.remove("hidden");
}

// Função para reproduzir som com base no evento
function playSound(audioName) {
  const audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.play(); // Reproduz o áudio
}

// Inicializa o jogo ao carregar a página
function initialize() {
  addClickListeners();
  state.view.startButton.addEventListener("click", startGame);
}

// Chama a função de inicialização ao carregar o DOM
document.addEventListener("DOMContentLoaded", initialize);
