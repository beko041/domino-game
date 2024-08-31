const allCards = [
    { left: 0, right: 0 },
    { left: 0, right: 1 },
    { left: 0, right: 2 },
    { left: 0, right: 3 },
    { left: 0, right: 4 },
    { left: 0, right: 5 },
    { left: 0, right: 6 },
    { left: 1, right: 1 },
    { left: 1, right: 2 },
    { left: 1, right: 3 },
    { left: 1, right: 4 },
    { left: 1, right: 5 },
    { left: 1, right: 6 },
    { left: 2, right: 2 },
    { left: 2, right: 3 },
    { left: 2, right: 4 },
    { left: 2, right: 5 },
    { left: 2, right: 6 },
    { left: 3, right: 3 },
    { left: 3, right: 4 },
    { left: 3, right: 5 },
    { left: 3, right: 6 },
    { left: 4, right: 4 },
    { left: 4, right: 5 },
    { left: 4, right: 6 },
    { left: 5, right: 5 },
    { left: 5, right: 6 },
    { left: 6, right: 6 },
];

let playersHands = [[], []];
let table = [];
let currentPlayer = 0;
let scores = [0, 0];
let selectedCardIndex = null;

function setupGame() {
    shuffleCards();
    playersHands = [[], []];

    for (let i = 0; i < 5; i++) {
        playersHands[0].push(drawCard());
        playersHands[1].push(drawCard());
    }
    
    displayPlayerHands();
    displayTable();
    updateGameStatus();
    updateScores();
}

function shuffleCards() {
    for (let i = allCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
    }
}

function drawCard() {
    if (allCards.length === 0) {
        console.warn('Kartlar bitti!');
        return null;
    }
    return allCards.pop();
}

function displayPlayerHands() {
    document.getElementById('player-hand-1').innerHTML = '';
    document.getElementById('player-hand-2').innerHTML = '';

    playersHands[0].forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        cardElement.dataset.player = 0;
        cardElement.innerHTML = `<div class="card-number">${card.left} | ${card.right}</div>`;
        cardElement.addEventListener('click', () => selectCard(index, 0));
        document.getElementById('player-hand-1').appendChild(cardElement);
    });

    playersHands[1].forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card hidden'; // Başlangıçta gizle
        cardElement.dataset.index = index;
        cardElement.dataset.player = 1;
        cardElement.innerHTML = `<div class="card-number">${card.left} | ${card.right}</div>`;
        cardElement.addEventListener('click', () => selectCard(index, 1));
        document.getElementById('player-hand-2').appendChild(cardElement);
    });
}

function selectCard(index, player) {
    document.querySelectorAll(`#player-hand-${player + 1} .card`).forEach(card => {
        card.classList.remove('selected');
    });

    const selectedCard = document.querySelector(`#player-hand-${player + 1} .card[data-index="${index}"]`);
    selectedCard.classList.add('selected');
    selectedCardIndex = { index, player };
}

function addCardToTable() {
    if (selectedCardIndex !== null && selectedCardIndex.index >= 0) {
        const { index, player } = selectedCardIndex;
        const card = playersHands[player].splice(index, 1)[0];
        table.push(card);
        displayPlayerHands();
        displayTable();
        selectedCardIndex = null;
        checkGameEnd();
        switchPlayer();
    } else {
        console.warn('Geçersiz kart seçimi!');
    }
}

function displayTable() {
    const tableDiv = document.getElementById('table');
    tableDiv.innerHTML = '';
    if (table.length === 0) {
        tableDiv.textContent = 'Tabloda kart yok!';
    } else {
        table.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `<div class="card-number">${card.left} | ${card.right}</div>`;
            tableDiv.appendChild(cardElement);
        });
    }
}

function updateGameStatus() {
    const currentPlayerElement = document.getElementById('current-player');
    currentPlayerElement.textContent = `Sıradaki Oyuncu: Oyuncu ${currentPlayer + 1}`;
}

function switchPlayer() {
    currentPlayer = (currentPlayer + 1) % 2;
    updateGameStatus();
}

function checkGameEnd() {
    playersHands.forEach((hand, index) => {
        if (hand.length === 0) {
            alert(`Oyuncu ${index + 1} kazandı!`);
            updateScores();
            setupGame();
        }
    });
}

function updateScores() {
    scores = [0, 0];
    playersHands.forEach((hand, index) => {
        hand.forEach(card => {
            scores[index] += card.left + card.right;
        });
    });

    document.getElementById('player1-score').textContent = scores[0];
    document.getElementById('player2-score').textContent = scores[1];
}

function restartGame() {
    setupGame();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-to-table-button').addEventListener('click', addCardToTable);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    setupGame();
});
