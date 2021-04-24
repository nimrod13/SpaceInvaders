document.addEventListener("DOMContentLoaded", () => {
    let playerPosition = 202; //starting point of player
    let invadersPosition = 0; //starting point of invaders
    let score = 0;
    let invadersDirection = "right";
    let cells = document.querySelectorAll(".cell"); //array of all cells in the grid
    let movingIntervalId;
    let invaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ];

    cells[playerPosition].classList.add("player");
    drawInvaders();

    document.querySelector(".start-button").addEventListener("click", e => {
        if (movingIntervalId !== null) {
            clearInterval(movingIntervalId);
        }

        movingIntervalId = setInterval(moveInvaders, 1000);

        document.addEventListener("keydown", (e) => {
            console.log(e.keyCode);

            switch (e.keyCode) {
                case 37:
                    moveLeft();
                    break;
                case 39:
                    moveRight();
                    break;
                case 38:
                    moveUp();
                    break;
                case 40:
                    moveDown();
                    break;
                case 32:
                    shootLaser();
                    break;
            }
        });
    });

    function shootLaser() {
        let laserPosition = playerPosition;

        function moveLaser() {
            cells[laserPosition].classList.remove("laser");
            laserPosition -= 15;
            if (laserPosition < 0) {
                clearInterval(laserId);
            }

            cells[laserPosition].classList.add("laser");
            let hitByLaser = invaders.find(invaderRelativePosition => invaderRelativePosition + invadersPosition === laserPosition);
            if (hitByLaser != null) {
                cells[hitByLaser + invadersPosition].classList.remove("invader");
                cells[hitByLaser + invadersPosition].classList.remove("laser");
                invaders = invaders.filter(invader => invader !== hitByLaser);
                score += 1;
                document.querySelector(".score").innerHTML = score;
                clearInterval(laserId);
            }
        }

        let laserId = setInterval(moveLaser, 500);
    }

    function moveInvaders() {
        if (invadersDirection === 'left') {
            if (invadesTouchingLeftEdge()) {
                moveInvadersDown();
                invadersDirection = 'right';
            } else {
                moveInvadersLeft();
            }
        } else if (invadersDirection === 'right') {
            if (invadersTouchingRightEdge()) {
                moveInvadersDown();
                invadersDirection = 'left';
            } else {
                moveInvadersRight();
            }
        }

        // playAlienCreak();
        checkGameOver();
    }

    function moveInvadersDown() {
        undrawInvaders();
        invadersPosition += 15;
        drawInvaders();
    }

    function moveInvadersRight() {
        undrawInvaders();
        invadersPosition += 1;
        drawInvaders();
    }

    function moveInvadersLeft() {
        undrawInvaders();
        invadersPosition -= 1;
        drawInvaders();
    }


    function moveLeft() {
        if (touchingLeftEdge()) {
            return;
        }

        cells[playerPosition].classList.remove("player");
        playerPosition--;
        cells[playerPosition].classList.add("player");
    }

    function moveRight() {
        if (touchingRightEdge()) {
            return;
        }

        cells[playerPosition].classList.remove("player");
        playerPosition++;
        cells[playerPosition].classList.add("player");
    }

    function moveUp() {
        if (touchingTopEdge()) {
            return;
        }

        cells[playerPosition].classList.remove("player");
        playerPosition -= 15;
        cells[playerPosition].classList.add("player");
    }

    function moveDown() {
        if (touchingBottomEdge()) {
            return;
        }

        cells[playerPosition].classList.remove("player");
        playerPosition += 15;
        cells[playerPosition].classList.add("player");
    }

    function touchingLeftEdge() {
        return playerPosition % 15 === 0;
    }

    function touchingRightEdge() {
        return playerPosition % 15 === 14;
    }

    function invadersTouchingRightEdge() {
        return invaders.some(relativePosition => (relativePosition + invadersPosition) % 15 === 14);
    }

    function invadesTouchingLeftEdge() {
        return invaders.some(relativePosition => (relativePosition + invadersPosition) % 15 === 0)
    }

    function touchingTopEdge() {
        return playerPosition < 15;
    }

    function touchingBottomEdge() {
        return playerPosition + 15 >= 225;
    }

    function drawInvaders() {
        invaders.forEach(relativePosition => {
            if (relativePosition < 10) {
                cells[relativePosition + invadersPosition].classList.add('invader-1');
            } else if (relativePosition < 25) {
                cells[relativePosition + invadersPosition].classList.add('invader-2');
            } else {
                cells[relativePosition + invadersPosition].classList.add('invader-3');
            }
        });
    }

    function undrawInvaders() {
        invaders.forEach(relativePosition => {
            cells[relativePosition + invadersPosition].classList.remove('invader-1');
            cells[relativePosition + invadersPosition].classList.remove('invader-2');
            cells[relativePosition + invadersPosition].classList.remove('invader-3');
        });
    }

    function playAlienCreak() {
        let audio = new Audio('assets/alien.wav');
        audio.play();
    }

    function playGameOver() {
        let audio = new Audio('assets/game-over.mp3');
        audio.play();
    }

    function checkGameOver() {
        if (invaders.some(realtivePosition => realtivePosition + invadersPosition === playerPosition)) {
            let dialog = document.querySelector('.dialog');

            if (!dialog) {
                const dialog = document.createElement("dialog");
                dialog.classList.add("dialog");
                document.body.appendChild(dialog);
                let text = document.createTextNode("An invader got you!");
                const closeBtn = document.createElement("button");
                closeBtn.classList.add("close-btn");
                closeBtn.innerText = "Close";

                closeBtn.addEventListener('click', () => {
                    dialog.close();
                });

                dialog.appendChild(text);
                dialog.appendChild(closeBtn);
                dialog.showModal();
            } else {
                dialog.showModal();
            }

            // playGameOver();
            clearInterval(movingIntervalId);
        }
    }
});