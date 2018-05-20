// Code your JavaScript / jQuery solution here

var turn = 0
var board = []
const winCombos = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
]

let currentGame = 0

$(document).ready(function() {
  attachListeners()
})


function player() {
  let token = ''
  if (turn % 2 === 0) {
    ++turn
     token = 'X'

  } else {
   ++turn
   token = 'O'
  }
  return token
}

function updateState(element) {
  let token = player()
  if (element.innerHTML === "") {
  element.innerHTML = token
} else {
  turn -= 1
}
}

function setMessage(string) {
  document.getElementById("message").innerHTML = string
}

function checkWinner() {
  // let board = []
  let tds = document.querySelectorAll("td")
  for(i = 0; i < tds.length; i++) {
    board[i] = tds[i].innerHTML
  }
  for(let combo of winCombos) {
    if (board[combo[0]] !== '' && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`)
      return true
    }
  }
return false
}

function doTurn(element) {

  if (updateState(element)) {
    turn+= 1
  }
  if (checkWinner()) {
    resetBoard()
  } else if (turn === 9){
    setMessage("Tie game.")
    resetBoard()
  }
}

function resetBoard() {
  turn = 0
  let tds = document.querySelectorAll("td")
  for(i = 0; i < tds.length; i++) {
    tds[i].innerHTML = ""
  }
}

function attachListeners() {
  clickedSquare()
  clearGamebutton()
  saveGamebutton()
  previousGamesbutton()
}

function clickedSquare() {
  $('table').on('click', 'td', function(e) {
    if (!checkWinner()) {
      doTurn(e.target)
    }
  })
}

function clearGamebutton() {
  $('#clear').on('click', resetBoard)
}

function saveGamebutton() {
  $('#save').on('click', saveGame)
}

function previousGamesbutton() {
  $('#previous').on('click', previousGames)
}

function saveGame() {
  let tds = document.querySelectorAll("td")
  for(i = 0; i < tds.length; i++) {
    board[i] = tds[i].innerHTML
  }
  if (currentGame !== 0) {
    $.ajax({
      type: 'PATCH',
      url: '/games' + currentGame,
      dataType: 'json'
      tds: {state: data}
    }).done(function(game) {
      let gameData = game.data
      currentGame = gameData.id
    })
  } else {
    $.post('/games', {state: data}, function(game){
      let id = game.data.id
      currentGame = id
      $('#games').append(`<button id="${id}">Game ${id}</button>`)
    })
  }
}

function previousGames() {}
