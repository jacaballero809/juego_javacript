document.addEventListener("DOMContentLoaded", () => {
    // Selecciona todas las celdas del tablero
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset");
    const pvpButton = document.getElementById("pvp");
    const pvcButton = document.getElementById("pvc");
    const boardElement = document.getElementById("board");
    const modeElement = document.getElementById("mode");
    const gameModeSpan = document.getElementById("gameMode");
    const statsElement = document.getElementById("stats");
    const mostWinsElement = document.getElementById("mostWins");
    const mostLossesElement = document.getElementById("mostLosses");
    const totalGamesElement = document.getElementById("totalGames");

    // Variables para el estado del juego y estadísticas de los jugadores
    let currentPlayer = "X";
    let board = ["", "", "", "", "", "", "", "", ""];// creo una variable llamada board y asigno un arreglo 
//(array) con 9 elementos, todos inicializados con cadenas vacías (""). Este arreglo representa el estado de un tablero de tres en línea 
    let gameMode = ""; // "PVP" o "PVC que es jugador vs judador y jugador vs maquina"
    let gameActive = false;
    let playerXWins = 0;
    let playerOWins = 0;
    let playerXLosses = 0;
    let playerOLosses = 0;
    let totalGames = 0;

    // Combinaciones ganadoras del juego Aquí se está creo una constante llamada winningCombinations que contiene un arreglo.
    //Cada uno de estos arreglos internos representa una combinación de índices en un tablero de 3x3 que resultaría en una victoria.
    //En un juego de tres en línea, el tablero se puede visualizar como un arreglo unidimensional de 9 elementos donde cada índice representa una celda
    const winningCombinations = [
        [0, 1, 2],// Línea horizontal en la primera fila.
        [3, 4, 5],//Línea horizontal en la segunda fila
        [6, 7, 8],//Línea horizontal en la tercera fila
        [0, 3, 6],//Línea vertical en la primera columna
        [1, 4, 7],// Línea vertical en la segunda columna
        [2, 5, 8],//Línea vertical en la tercera columna
        [0, 4, 8],//Línea diagonal de la esquina superior izquierda a la esquina inferior derecha
        [2, 4, 6] //Línea diagonal de la esquina superior derecha a la esquina inferior izquierda
    ];

    // Función que maneja el clic en una celda del tablero
    function handleCellClick(event) {
        const cell = event.target;
        const index = cell.getAttribute("data-index");

        if (board[index] === "" && gameActive) {
            board[index] = currentPlayer;
            cell.textContent = currentPlayer;
            if (checkWin()) {
                gameActive = false;
                if (currentPlayer === "X") {
                    playerXWins++;
                    playerOLosses++;
                } else {
                    playerOWins++;
                    playerXLosses++;
                }
                updateStats();
                if (playerXWins === 3 || playerOWins === 3) {
                    setTimeout(() => {
                        alert(`¡${currentPlayer} gana y alcanza los 3 puntos!`);
                        resetStats(); // Reiniciar estadísticas cuando un jugador alcanza los 3 puntos
                        resetGame();
                    }, 100);
                } else {
                    setTimeout(() => {
                        alert(`¡${currentPlayer} gana!`);
                        resetGame(); // Reiniciar juego después de la alerta de victoria
                    }, 100);
                }
            } else if (board.every(cell => cell !== "")) {
                gameActive = false;
                totalGames++;
                updateStats();
                setTimeout(() => alert("¡Empate!"), 100);
            } else {
                currentPlayer = currentPlayer === "X" ? "O" : "X";
                if (gameMode === "PVC" && currentPlayer === "O") {
                    setTimeout(computerMove, 500); // Simular que la computadora piensa
                }
            }
        }
    }

    // Función para reiniciar el juego
    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        cells.forEach(cell => {
            cell.textContent = "";
        });
        updateStats();
    }

    // Función para reiniciar las estadísticas
    function resetStats() {
        playerXWins = 0;
        playerOWins = 0;
        playerXLosses = 0;
        playerOLosses = 0;
        totalGames = 0;
        updateStats();
    }

    // Función para verificar si hay una combinación ganadora
    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return board[index] === currentPlayer;
            });
        });
    }

    // Esta función se llama cuando es el turno de la computadora en el modo Jugador vs Máquina
    // Genera un movimiento aleatorio para la computadora y actualiza el tablero
    function computerMove() {
        let availableCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
        let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        board[randomIndex] = currentPlayer;
        document.querySelector(`.cell[data-index='${randomIndex}']`).textContent = currentPlayer;
        if (checkWin()) {
            gameActive = false;
            if (currentPlayer === "X") {
                playerXWins++;
                playerOLosses++;
            } else {
                playerOWins++;
                playerXLosses++;
            }
            updateStats();
            if (playerXWins === 3 || playerOWins === 3) {
                setTimeout(() => {
                    alert(`¡${currentPlayer} gana y alcanza los 3 puntos!`);
                    resetStats(); // Reiniciar estadísticas cuando un jugador alcanza los 3 puntos
                    resetGame();
                }, 100);
            } else {
                setTimeout(() => alert(`¡${currentPlayer} gana!`), 100);
            }
        } else if (board.every(cell => cell !== "")) {
            gameActive = false;
            totalGames++;
            updateStats();
            setTimeout(() => alert("¡Empate!"), 100);
        } else {
            currentPlayer = "X";
        }
    }

    // Esta función actualiza las estadísticas mostradas en la interfaz del juego
    // Muestra el jugador con más victorias, más derrotas y el total de juegos cerrados
    function updateStats() {
        mostWinsElement.textContent = `${playerXWins > playerOWins ? 'Jugador X' : 'Jugador O'} (${Math.max(playerXWins, playerOWins)} victorias / ${Math.min(playerXWins, playerOWins)} derrotas)`;
        mostLossesElement.textContent = `${playerXLosses > playerOLosses ? 'Jugador X' : 'Jugador O'} (${Math.max(playerXLosses, playerOLosses)} derrotas / ${Math.min(playerXLosses, playerOLosses)} victorias)`;
        totalGamesElement.textContent = `Total de juegos cerrados: ${totalGames}`;
    }

    // Esta función se llama al hacer clic en los botones "Jugador vs Jugador" o "Jugador vs Máquina"
    // Actualiza el modo de juego, muestra el modo de juego seleccionado en la interfaz y reinicia el juego
    function startGame(mode) {
        gameMode = mode;
        gameModeSpan.textContent = mode === "PVP" ? "Jugador vs Jugador" : "Jugador vs Máquina";
        modeElement.classList.remove("hidden");
        resetGame();
        boardElement.classList.remove("hidden");
        statsElement.classList.remove("hidden");
        resetButton.classList.remove("hidden");
    }

    // Event listeners para los botones y celdas del tablero
    pvpButton.addEventListener("click", () => startGame("PVP"));
    pvcButton.addEventListener("click", () => startGame("PVC"));
    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetButton.addEventListener("click", resetGame);
});
