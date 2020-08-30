const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

// TODO
/*
 * Speed Bonûs (cai como se fosse uma enemySpaceship)
 * Score
 * Boss
 * Dificuldade (levelSpeed)
*/

let keys = {}, currentState, levelSpeed = 70,

states = {
    play: 0,
    playing: 1,
    lose: 2
},

enemySpaceship = {

    _enemys: [],
    
    width: 50,
    height: 40,
    speed: 5,
    lifes: 2,
    insertTime: 0,

    // Function responsible for inserting "enemy ships" in the _enemies array
    insert() {
        this._enemys.push({
            x: 5 + Math.floor(840 * Math.random()),
            y: -20,
            width: this.width,
            height: this.height
        })

        // Related to the time each ship will appear
        this.insertTime = levelSpeed + Math.floor(21 * Math.random());
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
    lifes: 3,

    update() {

        // keyCode A = 65 | keyCode D = 68
        if (65 in keys && this.x > 0) {
            this.x -= this.speed;
        } else if (68 in keys && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }

    },

    draw() {
        spriteSpaceship.draw(this.x, this.y);
        // ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
    }
},

shot = {

    _shots: [],

    height: 10,
    width: 30,
    speed: 20,

    fire() {
        // When space is pressed, a new Bullet object will be instantiated
        this._shots.push(new Bullet(spaceship.x + spaceship.width / 2 - 15, spaceship.y, this.width, this.height));
    },

    update() {

        // Each bullet is an object within the _shots array
        if (this._shots.length != 0) {
            for (i in this._shots) {

                let shot = this._shots[i]

                // If your Y is less than 150px (range of shot), keep decreasing the speed
                if (shot.y >= 150) {
                    this._shots[i].y -= this.speed;
                    
                    // Loop to check if the bullet will hit enemy aircraft
                    for (let i = 0; i < enemySpaceship._enemys.length; i++) {
                        let enemy = enemySpaceship._enemys[0];

                        if (shot.y <= enemy.y + enemy.height) {
                            this._shots.splice(i, 1);

                            // Colliding with enemy spaceships
                            if (shot.x + shot.width >= enemy.x && shot.x <= enemy.x + enemy.width) {
                                this._shots.splice(i, 1);
                                // If the shot strikes the ship, remove the ship from the enemys array
                                enemySpaceship._enemys.splice(0, 1)
                            }
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bg.draw(0, 0);

    ctx.fillStyle = '#fff';

    spaceship.draw();
    enemySpaceship.draw();
    shot.draw();
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
}

function onKeyDown(e) {
    keys[e.keyCode] = true;

    // keyCode spacebar = 32
    if (e.keyCode == 32) {
        shot.fire();
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


    // Storing record in localStorage
    // localStorage.setItem("record", this.score); <- atualizando record
    
    run();
}

main();