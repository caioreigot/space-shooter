const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

// TODO
/*
 * Tela game over e de play
 * Speed Bonus (cai como se fosse uma enemySpaceship)
 * Boss
 * Dificuldade (levelSpeed)
*/

let keys = {}, currentState, levelSpeed = 35,

states = {
    play: 0,
    playing: 1,
    lose: 2
},

enemySpaceship = {

    _enemys: [],
    
    width: 50,
    height: 40,
    speed: 4,
    lifes: 1,
    insertTime: 0,

    // Function responsible for inserting "enemy ships" in the _enemies array
    insert() {
        if (currentState == states.playing && currentState != states.lose) {
            this._enemys.push({
                x: 5 + Math.floor(840 * Math.random()),
                y: -20,
                width: this.width,
                height: this.height
            })
    
            // Related to the time each ship will appear
            this.insertTime = levelSpeed + Math.floor(21 * Math.random());
        }
    },

    update() {
        if (this.insertTime == 0) {
            this.insert();
        } else {
            this.insertTime--; 
        }

        // 
        for (let i = 0; i < this._enemys.length; i++) {

            var enemy = this._enemys[i];
            enemy.y += this.speed;

            if (enemy.y > canvas.height) {
                this._enemys.splice(i, 1);
                spaceship.lifes -= 1;
            }

        }

    },

    draw() {
        for (let i = 0; i < this._enemys.length; i++) {
            var enemy = this._enemys[i];

            spriteEnemySpaceship.draw(enemy.x, enemy.y);
            // ctx.fillRect(enemy.x, enemy.y, this.width, this.height);
        }
    },

    clean() {
        this._enemys = [];
    }
},

spaceship = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 60,
    width: 60, 
    height: 50,
    speed: 12,
    score: 0,
    lifes: 3,

    update() {

        // keyCode A = 65 | keyCode D = 68
        if (65 in keys && this.x > 0 && currentState == states.playing) {
            this.x -= this.speed;
        } else if (68 in keys && this.x < canvas.width - this.width && currentState == states.playing) {
            this.x += this.speed;
        }

        if (this.lifes == 0) {
            currentState = states.lose;

            if (this.score > record) {
                // Storing the score in local storage, so as not to delete when closing the site or browser
                localStorage.setItem("record", this.score);
                record = this.score;
            }
        }

    },

    draw() {
        spriteSpaceship.draw(this.x, this.y);
        // ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
    },

    resetPosition() {
        this.x = canvas.width / 2 - 30;
        this.y = canvas.height - 60;
        this.speed = 12;
    },

    resetScore() {

        if (this.score > record) {
            // Storing the score in local storage, so as not to delete when closing the site or browser
            localStorage.setItem("record", this.score);
            record = this.score;
        }

        this.score = 0;
    },

    resetLife() {
        this.lifes = 3;
    }
    
},

shot = {

    _shots: [],

    height: 10,
    width: 30,
    speed: 20,

    fire() {
        // When space is pressed, a new Bullet object will be instantiated
        if (currentState == states.playing && currentState != states.lose)
            this._shots.push(new Bullet(spaceship.x + spaceship.width / 2 - 15, spaceship.y, this.width, this.height));
    },

    update() {

        // Each bullet is an object within the _shots array
        if (this._shots.length != 0) {
            // Loop to look at each bullet (i) and see if it will collide or leave the screen
            for (i in this._shots) {
                let shot = this._shots[i]

                // If your Y is less than 0px (range of canvas height - shot.height), keep decreasing the speed of shot
                if (shot.y >= 10) {
                    this._shots[i].y -= this.speed;
                    
                    // Loop to check if the bullet will hit enemy aircraft (j)
                    for (let j = 0; j < enemySpaceship._enemys.length; j++) {
                        let enemy = enemySpaceship._enemys[j];

                        // Colliding with enemy spaceships
                        if (shot.x + shot.width >= enemy.x && shot.x <= enemy.x + enemy.width && shot.y <= enemy.y + enemy.height) {
                            this._shots.splice(i, 1);

                            // If the shot strikes the ship, remove the ship from the enemys array
                            enemySpaceship._enemys.splice(j, 1)
                            spaceship.score++;
                        }
                        
                    }

                } else { // If reach the end of the screen, remove the shot from the array
                    this._shots.splice(i, 1);
                }

            }
        }
    },

    draw() {

        if (this._shots.length != 0) {
            for (i in this._shots) {

                let shot = this._shots[i]
                spriteShoot.draw(shot.x, shot.y)
                // ctx.fillRect(shot.x, shot.y, shot.width, shot.height);

            }
        }

    }

}

function run() {
    update();
    draw();

    window.requestAnimationFrame(run); // loop
}

function update() {
    spaceship.update();
    enemySpaceship.update();
    shot.update();
}

function draw() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    bg.draw(0, 0);

    // Score
    ctx.fillStyle = '#fff';
    ctx.font = "50px Arial";
    
    if (currentState == states.play) {
        spritePlayButton.draw(canvas.width / 2 - spritePlayButton.width / 2, canvas.height / 2 - spritePlayButton.height / 2);
    }

    if (currentState == states.playing) {
        spaceship.draw();
        enemySpaceship.draw();
        shot.draw();

        ctx.fillText(spaceship.score, 30, 68);
    }


    // Keep drawing spaceship life when lose the game
    if (currentState == states.playing || currentState == states.lose) {

        if (spaceship.lifes == 3) {
            sprite3Lifes.draw(730, 20);
        } else if (spaceship.lifes == 2) {
            sprite2Lifes.draw(730, 20);
        } else if (spaceship.lifes == 1) {
            sprite1Lifes.draw(730, 20);
        } else {
            sprite0Lifes.draw(730, 20);
        }
    }

    // When losing, show the scoreboard, with the player's score and his record
    if (currentState == states.lose) {
        enemySpaceship.clean();
        spaceship.resetPosition();

        spriteScoreboard.draw(canvas.width / 2 - spriteScoreboard.width / 2, canvas.height / 2 - spriteScoreboard.height / 2);

        // Showing the score and record on the scoreboard
        if (spaceship.score < 10) {
            ctx.fillText(spaceship.score, canvas.width / 2 + 84, canvas.height / 2 - 9.5);
        } else if (spaceship.score >= 10 && spaceship.score < 100) {
            ctx.fillText(spaceship.score, canvas.width / 2 + 68, canvas.height / 2 - 9.5);
        } else if (spaceship.score >= 100 && spaceship.score < 1000) {
            ctx.fillText(spaceship.score, canvas.width / 2 + 56, canvas.height / 2 - 9.5);
        } else {
            ctx.fillText(spaceship.score, canvas.width / 2 + 42, canvas.height / 2 - 9.5);
        }

        if (record < 10) {
            ctx.fillText(record, canvas.width / 2 + 84, canvas.height / 2 + 83);
        } else if (record >= 10 && record < 100) {
            ctx.fillText(record, canvas.width / 2 + 68, canvas.height / 2 + 83);
        } else if (record >= 100 && record < 1000) {
            ctx.fillText(record, canvas.width / 2 + 56, canvas.height / 2 + 83);
        } else {
            ctx.fillText(record, canvas.width / 2 + 42, canvas.height / 2 + 83);
        }

        if (spaceship.score > record - 1) {
            spriteNew.draw(canvas.width / 2 - spriteNew.width / 2 + 160, canvas.height / 2 - spriteNew.height / 2 + 105);
        }

    }

}

function Bullet(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

function onMouseDown(e) {
    if (e.button == 0) {
        shot.fire();
    }

    if (e.button == 0 && currentState == states.play) {
        currentState = states.playing;
    }

    if (e.button == 0 && currentState == states.lose) {
        currentState = states.playing;
        spaceship.resetScore();
        spaceship.resetLife();
    }
}

function onKeyDown(e) {
    keys[e.keyCode] = true;

    // keyCode spacebar = 32
    if (e.keyCode == 32) {
        shot.fire();
    }

    if (e.keyCode == 32 && currentState == states.play) {
        currentState = states.playing;
    } else if (e.keyCode == 32 && currentState == states.lose) {
        currentState = states.playing;
        spaceship.resetScore();
        spaceship.resetLife();
    }
}

function onKeyUp(e) {
    delete keys[e.keyCode];
}

function main() {

    // Loading the sheet image
    img = new Image();
    img.src = "./images/sheet.png";

    // Identify if the user pressed any key
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    
    currentState = states.play;
    // If the player already has a record
    record = localStorage.getItem("record");

    if (record == null) {
        record = 0;
    }

    run();
}

main();