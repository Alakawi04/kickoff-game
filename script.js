let wordList = [
    { word: 'kickoff', hint: 'The name of the event😁' },
    { word: 'computer', hint: 'Electronic device for processing data😉' },
    { word: 'society', hint: 'Group of people living together🤷' },
    { word: 'olive', hint: 'A fruit for which Palestine is famous🫒' },
    { word: 'zaytoonah', hint: 'Our beloved university 😍' },
    { word: 'courses', hint: 'A group of lessons on one subject😙' },
    { word: 'integer', hint: 'Whole number in mathematics 🤓' },
    { word: 'coding', hint: 'Writing computer programs 😎' },
    { word: 'programming', hint: 'The process of writing code 🤖' },
];

let selectedWord;
let displayedWord;
let remainingAttempts = 6;  
let gameStatus = 'start';

const wordContainer = document.getElementById('word-container');
const hintText = document.getElementById('hint-text');
const attemptsText = document.getElementById('attempts');
const statusText = document.getElementById('status');
const hangmanCanvas = document.getElementById('hangmanCanvas');
const alphabetContainer = document.getElementById('alphabet');
const gameResult = document.getElementById('game-result');

const ctx = hangmanCanvas.getContext('2d');
const baseImage = new Image();
baseImage.src = 'img/startg.png'; 

function startGame() {
    remainingAttempts = 6;
    gameStatus = 'playing';
    const randomIndex = Math.floor(Math.random() * wordList.length); 
    selectedWord = wordList[randomIndex].word;
    displayedWord = '_'.repeat(selectedWord.length);
    wordContainer.innerHTML = displayedWord;
    hintText.innerHTML = `Hint: ${wordList[randomIndex].hint}`;
    alphabetContainer.innerHTML = '';
    updateGameInfo();
    createAlphabetButtons();
    drawHangman();  
    gameResult.style.display = 'none';
    drawBaseImage();  
}

function drawBaseImage() {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height); 
    ctx.drawImage(baseImage, 0, 0, hangmanCanvas.width, hangmanCanvas.height); 
}

function updateGameInfo() {
    attemptsText.innerText = `Remaining Attempts: ${remainingAttempts}`;
}

function createAlphabetButtons() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach(letter => {
        const button = document.createElement('button');
        button.innerText = letter;
        button.classList.add('keyboard-btn');
        button.onclick = () => handleLetterClick(letter, button);
        alphabetContainer.appendChild(button);
    });
}

function handleLetterClick(letter, button) {
    if (gameStatus === 'lost' || gameStatus === 'won') return; 
    button.disabled = true; 
    if (selectedWord.includes(letter)) {
        displayedWord = updateDisplayedWord(letter);
        wordContainer.innerHTML = displayedWord;
        checkGameStatus();
    } else {
        remainingAttempts--;
        updateGameInfo();
        drawHangman();  
        checkGameStatus();
    }
}

function updateDisplayedWord(letter) {
    let updatedWord = '';
    for (let i = 0; i < selectedWord.length; i++) {
        updatedWord += selectedWord[i] === letter ? letter : displayedWord[i];
    }
    return updatedWord;
}

function displayGameResult(message, isSuccess) {
    gameResult.innerText = message;
    gameResult.style.color = isSuccess ? 'green' : 'red'; 
    gameResult.style.display = 'block';
    disableAlphabetButtons();
}

function disableAlphabetButtons() {
    const buttons = alphabetContainer.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
}

function drawHangman() {
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    ctx.drawImage(baseImage, 0, 0, hangmanCanvas.width, hangmanCanvas.height);

    const offsetY = 0;

    ctx.beginPath();
    ctx.strokeStyle = '#000';  
    ctx.lineWidth = 6;  

    if (remainingAttempts <= 5) {
        ctx.fillStyle = 'black';
        ctx.arc(152, 120 + offsetY, 20, 0, Math.PI * 2, true);
        ctx.fill(); 
    }

    if (remainingAttempts <= 4) ctx.moveTo(152, 140 + offsetY), ctx.lineTo(152, 200 + offsetY);

    if (remainingAttempts <= 3) ctx.moveTo(152, 160 + offsetY), ctx.lineTo(100, 200 + offsetY);
    if (remainingAttempts <= 2) ctx.moveTo(152, 160 + offsetY), ctx.lineTo(200, 200 + offsetY); 

    if (remainingAttempts <= 1) ctx.moveTo(152, 200 + offsetY), ctx.lineTo(100, 250 + offsetY); 
    if (remainingAttempts <= 0) ctx.moveTo(152, 200 + offsetY), ctx.lineTo(200, 250 + offsetY);

    ctx.stroke();
}

function checkGameStatus() {
    if (!displayedWord.includes('_')) {
        gameStatus = 'won';
        displayGameResult(`🎉 Congratulations! You won! `, true);
        setTimeout(startGame, 2000);
    } else if (remainingAttempts === 0) {
        gameStatus = 'lost';
        displayGameResult(`❌ You lost! The word was: ${selectedWord} `, false);
        setTimeout(startGame, 2000); 
    }
}

startGame();
