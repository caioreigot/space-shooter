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
const spriteShoot = new Sprite(934, 137, 30, 10);

const spriteEnemySpaceship = new Sprite(925, 81, 50, 40)

const spriteMeteor1 = new Sprite(1185, 30, 50, 40);
const spriteMeteor2 = new Sprite(1185, 86, 50, 40);

// "Menus"
const spritePlay = new Sprite(1920, 0, 900, 600);
const spriteScoreboard = new Sprite(1298, 16, 589, 476);
const spriteNew = new Sprite(1366, 527, 88, 55);

const sprite3Lifes = new Sprite(1011, 30, 148, 37); 
const sprite2Lifes = new Sprite(1011, 83, 148, 37); 
const sprite1Lifes = new Sprite(1011, 133, 148, 37);
const sprite0Lifes = new Sprite(1011, 182, 148, 37);

const spriteLifeBonus = new Sprite(934, 159, 30, 30);

const spriteAlienBoss = new Sprite(935, 259, 320, 150);
const spriteAlienBossShot = new Sprite(920, 434, 35, 50);