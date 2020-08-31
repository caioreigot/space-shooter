const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

// TODO
/*
 * Inimigos diferentes (se mexem pro lado, atiram, etc)
 * Speed Bônus (cai como se fosse uma enemySpaceship)
 * Boss
*/

// Game variables
let keys = {}, currentState, enemyInsertionSpeed = 60, meteorInsertionSpeed = 200, bossPhase = false,

states = {
    play: 0,
    playing: 1,
    lose: 2
},

spaceship = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 60,
    width: 60, 
    height: 50,
    leftRightSpeed: 12,
    upDownSpeed: 10,
    score: 0,
    lifes: 3,

    update() {

        // keyCode A = 65 | keyCode D = 68
        if (65 in keys && this.x > 0 && currentState == states.playing) {
            this.x -= this.leftRightSpeed;
        } else if (68 in keys && this.x < canvas.width - this.width && currentState == states.playing) {
            this.x += this.leftRightSpeed;
        }
        
        // keyCode S = 83 | keyCode W = 87
        if (83 in keys && this.y < canvas.height - spaceship.height && currentState == states.playing) {
            this.y += this.upDownSpeed;
        } else if (87 in keys && this.y > 0 && currentState == states.playing) {
            this.y -= this.upDownSpeed;
        }

        if (this.lifes == 0) {
            currentState = states.lose;

            if (this.score > record) {
                // Storing the score in local storage, so as not to delete when closing the site or browser
                localStorage.setItem("record", this.score);
                record = this.score;
            }
        }

        // Increasing enemy and meteor insertion time (difficulty)
        if (this.score == 25) {
            enemyInsertionSpeed = 45;
            meteorInsertionSpeed = 170;
        }

        if (this.score == 50) {
            enemyInsertionSpeed = 35;
            meteorInsertionSpeed = 140;
            enemySpaceship.speed = 4;
        }

        if (this.score == 75) {
            bossPhase = true;
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

enemySpaceship = {

    _enemys: [],
    
    width: 50,
    height: 40,
    speed: 3,
    lifes: 1,
    insertTime: 0,

    // Function responsible for inserting "enemy ships" in the _enemies array
    insert() {
        if (currentState == states.playing && currentState != states.lose && bossPhase == false) {
            this._enemys.push({
                x: 5 + Math.floor(840 * Math.random()),
                y: -20,
                width: this.width,
                height: this.height
            })
    
            // Related to the time each ship will appear
            this.insertTime = enemyInsertionSpeed + Math.floor(21 * Math.random());
        }
    },

    update() {
        if (this.insertTime == 0) {
            this.insert();
        } else {
            this.insertTime--; 
        }

        // Loop to check if each enemy spaceships will pass the screen, damaging the spaceship and removing itself from the array
        for (let i = 0; i < this._enemys.length; i++) {

            let enemy = this._enemys[i];
            enemy.y += this.speed;

            if (enemy.y > canvas.height) {
                this._enemys.splice(i, 1);
                spaceship.lifes -= 1;
            }

        }

    },

    draw() {
        for (let i = 0; i < this._enemys.length; i++) {
            let enemy = this._enemys[i];

            spriteEnemySpaceship.draw(enemy.x, enemy.y);
            // ctx.fillRect(enemy.x, enemy.y, this.width, this.height);
        }
    },

    clean() {
        this._enemys = [];
    },

},

meteor = {

    _meteors: [],
    _sprites: [spriteMeteor1, spriteMeteor2],

    width: 50,
    height: 40,
    downSpeed: 1,
    insertTime: 0,

    // Function responsible for inserting meteors in the _meteors array
    insert() {
        if (currentState == states.playing && currentState != states.lose) {
            this._meteors.push({
                x: 5 + Math.floor(840 * Math.random()),
                y: -20,
                width: this.width,
                height: this.height,
                // Picking up the meteor design randomly
                sprite: this._sprites[Math.floor(this._sprites.length * Math.random())]
            })
    
            // Related to the time each ship will appear
            this.insertTime = meteorInsertionSpeed + Math.floor(61 * Math.random());
        }
    },

    update() {
        if (this.insertTime == 0) {
            this.insert();
        } else {
            this.insertTime--; 
        }

        for (let i = 0; i < this._meteors.length; i++) {

            let meteor = this._meteors[i];
            meteor.y += this.downSpeed;

            // If the meteor leaves the screen, remove it from the array
            if (meteor.y > canvas.height) {
                this._meteors.splice(i, 1);
            } // If the meteor collides with the spaceship, take life from it and remove it from the array
            else if (
                spaceship.x + spaceship.width >= meteor.x 
                && spaceship.x <= meteor.x + meteor.width 
                && spaceship.y <= meteor.y + meteor.height 
                && spaceship.y + spaceship.height >= meteor.y
                ) {
                this._meteors.splice(i, 1);
                spaceship.lifes -= 1;
            }

        }

    },

    draw() {
        for (let i = 0; i < this._meteors.length; i++) {
            let meteor = this._meteors[i];

            
            // Drawing the meteor sprite randomly that was generated by the object in insert()
            meteor.sprite.draw(meteor.x, meteor.y);
            // ctx.fillRect(meteor.x, meteor.y, this.width, this.height);
        }
    },

    clean() {
        this._meteors = [];
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
                        if (
                            shot.x + shot.width >= enemy.x 
                            && shot.x <= enemy.x + enemy.width 
                            && shot.y <= enemy.y + enemy.height
                            ) {
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
    meteor.update();
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
        meteor.draw();
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
        meteor.clean();
        spaceship.resetPosition();

        bossPhase = false;

        spriteScoreboard.draw(canvas.width / 2 - spriteScoreboard.width / 2, canvas.height / 2 - spriteScoreboard.height / 2);

        // Showing the score and record on the scoreboard
        if (spaceship.score < 10) {
            ctx.fillText(spaceship.score, canvas.width / 2 + 84, canvas.height / 2 - 9.5);
        } else if (spaceship.score >= 10 && spaceship.score < 100) {
            ctx.fillText(spaceship.score, canvas.width / 2 + 70, canvas.height / 2 - 9.5);
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

// Used to go back to the default "difficulty"
function resetSpeed() {
    enemyInsertionSpeed = 60;
    meteorInsertionSpeed = 200;
    enemySpaceship.speed = 2;
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
        currentState = states.play;
        spaceship.resetScore();
        spaceship.resetLife();
        resetSpeed();
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
        currentState = states.play;
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