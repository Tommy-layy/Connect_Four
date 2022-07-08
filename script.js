const board = document.querySelector('#board')
const replayScreen = document.querySelector('#ReplayScreen')
const gameOverText = document.querySelector('#GameOverText')
const resetButton = document.querySelector('#Replay')

resetButton.onclick = () => {
  location.reload()
}

const playerRed = 1
const playerYellow = 2
const chips = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]

let playerTurn = playerRed
let hoverColumn = -1
let animating = false

for (let i = 0; i < 42; i++) {
  let cell = document.createElement('div')
  cell.className = 'cell'
  board.appendChild(cell)

  cell.onmouseenter = () => {
    onMouseEnteredColumn(i % 7)
  }
  cell.onclick = () => {
    if (!animating) {
      onColumnClicked(i % 7)
    }
  }
}

function onColumnClicked(column) {
  let openRow = chips.filter((_, index) => index % 7 === column).lastIndexOf(0)
  if (openRow === -1) {
    return
  }

  chips[openRow * 7 + column] = playerTurn
  let cell = board.children[openRow * 7 + column]

  let chip = document.createElement('div')
  chip.className = 'chip'
  chip.dataset.placed = true
  chip.dataset.player = playerTurn
  cell.appendChild(chip)

  let unplacedchip = document.querySelector("[data-placed='false']")
  let unplacedY = unplacedchip.getBoundingClientRect().y
  let placedY = chip.getBoundingClientRect().y
  let yDiff = unplacedY - placedY

  animating = true
  removeUnplacedchip()
  let animation = chip.animate(
    [
      { transform: `translateY(${yDiff}px)`, offset: 0 },
      { transform: `translateY(0px)`, offset: 0.6 },
      { transform: `translateY(${yDiff / 20}px)`, offset: 0.8 },
      { transform: `translateY(0px)`, offset: 0.95 }
    ],
    {
      duration: 400,
      easing: 'linear',
      iterations: 1
    }
  )
  animation.addEventListener('finish', checkWinner)
}

function checkWinner() {
  animating = false

  if (!chips.includes(0)) {
    replayScreen.style.display = 'block'
    gameOverText.textContent = 'Draw'
  }

  if (winningPlayer(playerTurn, chips)) {
    replayScreen.style.display = 'block'
    gameOverText.textContent = `${
      playerTurn === playerRed ? 'Red' : 'Yellow'
    } is the winner!`
    gameOverText.dataset.winner = playerTurn
  }

  if (playerTurn === playerRed) {
    playerTurn = playerYellow
  } else {
    playerTurn = playerRed
  }
  switchHover()
}

function switchHover() {
  removeUnplacedchip()
  if (chips[hoverColumn] === 0) {
    let cell = board.children[hoverColumn]
    let chip = document.createElement('div')
    chip.className = 'chip'
    chip.dataset.placed = false
    chip.dataset.player = playerTurn
    cell.appendChild(chip)
  }
}

function removeUnplacedchip() {
  let unplacedchip = document.querySelector("[data-placed='false']")
  if (unplacedchip) {
    unplacedchip.parentElement.removeChild(unplacedchip)
  }
}

function onMouseEnteredColumn(column) {
  hoverColumn = column
  if (!animating) {
    switchHover()
  }
}

function winningPlayer(playerTurn, chips) {
  for (let index = 0; index < 42; index++) {
    if (
      index % 7 < 4 &&
      chips[index] === playerTurn &&
      chips[index + 1] === playerTurn &&
      chips[index + 2] === playerTurn &&
      chips[index + 3] === playerTurn
    ) {
      return true
    }

    if (
      index < 21 &&
      chips[index] === playerTurn &&
      chips[index + 7] === playerTurn &&
      chips[index + 14] === playerTurn &&
      chips[index + 21] === playerTurn
    ) {
      return true
    }

    if (
      index % 7 < 4 &&
      index < 18 &&
      chips[index] === playerTurn &&
      chips[index + 8] === playerTurn &&
      chips[index + 16] === playerTurn &&
      chips[index + 24] === playerTurn
    ) {
      return true
    }

    if (
      index % 7 >= 3 &&
      index < 21 &&
      chips[index] === playerTurn &&
      chips[index + 6] === playerTurn &&
      chips[index + 12] === playerTurn &&
      chips[index + 18] === playerTurn
    ) {
      return true
    }
  }
  return false
}
