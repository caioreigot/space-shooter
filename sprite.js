function Sprite(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.draw = function(xCanvas, yCanvas) {
        ctx.drawImage(img, this.x, this.y, this.width, this.height, xCanvas, yCanvas, this.width, this.height);
    }
}

const bg = new Sprite(0, 0, 900, 600);

const spriteSpaceship = new Sprite(920, 16, 60, 50);
const spriteEnemySpaceship = new Sprite(925, 81, 50, 40)
const spriteShoot = new Sprite(934, 137, 30, 10);

// "Menus"
const spritePlayButton = new Sprite(916, 222, 375, 375);
const spriteScoreboard = new Sprite(1298, 16, 589, 476);
const spriteNew = new Sprite(1366, 527, 88, 55);

const sprite3Lifes = new Sprite(1011, 30, 148, 37); 
const sprite2Lifes = new Sprite(1011, 83, 148, 37); 
const sprite1Lifes = new Sprite(1011, 133, 148, 37);
const sprite0Lifes = new Sprite(1011, 182, 148, 37);
