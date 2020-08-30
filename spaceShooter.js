const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

let keys = {}, currentState,

states = {
    play: 0,
    playing: 1,
    lose: 2
},

spaceship = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 60,
    height: 40,
    width: 60,
    speed: 10,
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
        ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
    }
},

shot = {
    _shots: [],

    height: 10,
    width: 30,
    speed: 20,

    fire() {

        // When space is pressed, a new Bullet object will be instantiated
        this._shots.push(new Bullet(spaceship.x + spaceship.width / 2 - 15, spaceship.y));
        
    },

    draw() {

        // Each bullet is an object within the _shots array, when it reaches the top of the screen, the bullet is removed from the array
        if (this._shots.length != 0) {
            for (i in this._shots) {

                ctx.fillRect(this._shots[i].x, this._shots[i].y, this.width, this.height);

                // If your Y is less than the end of the screen, keep decreasing the speed
                if (this._shots[i].y >= 0) {
                    this._shots[i].y -= this.speed;
                } // If you reach the end of the screen or collide with an enemy, remove the shot from the array
                else {
                    this._shots.splice(i, 1);
                }
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
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';

    spaceship.draw();
    shot.draw();
}

function Bullet(x, y, speed) {
    this.x = x;
    this.y = y;
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

    // Identify if the user pressed any key
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