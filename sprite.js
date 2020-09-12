function Sprite(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.draw = function(xCanvas, yCanvas) {
        ctx.drawImage(img, this.x, this.y, this.width, this.height, xCanvas, yCanvas, this.width, this.height);
    }
}

// Background
const bg = new Sprite(0, 0, 900, 600);

// "Player"
const spriteSpaceship = new Sprite(920, 16, 60, 50);
const spriteShoot = new Sprite(934, 137, 30, 10);

// Enemy spaceships
const spriteAlienEnemySpaceship = new Sprite(925, 81, 50, 40);
const sprite2PhaseEnemySpaceship = new Sprite(925, 209, 50, 40);
const sprite3PhaseEnemySpaceship = new Sprite(929, 451, 50, 40);
const sprite4PhaseEnemySpaceship = new Sprite(929, 517, 50, 40);

// Meteor
const spriteMeteor1 = new Sprite(1185, 30, 50, 40);
const spriteMeteor2 = new Sprite(1185, 86, 50, 40);

// Smoke destruction animation
const smoke1 = new Sprite(3885, 91, 46, 35);
const smoke2 = new Sprite(3964, 86, 57, 50);
const smoke3 = new Sprite(4057, 80, 75, 67);
const smoke4 = new Sprite(3867, 178, 106, 96);
const smoke5 = new Sprite(4010, 180, 122, 93);

// "Menus"
const spritePlay = new Sprite(1920, 0, 900, 600);
const spriteScoreboard = new Sprite(1298, 16, 589, 476);
const spriteNew = new Sprite(1366, 527, 88, 55);

// Lifes
const sprite3Lifes = new Sprite(1011, 30, 148, 37); 
const sprite2Lifes = new Sprite(1011, 83, 148, 37); 
const sprite1Lifes = new Sprite(1011, 133, 148, 37);
const sprite0Lifes = new Sprite(1011, 182, 148, 37);

const spriteLifeBonus = new Sprite(934, 159, 30, 30);

// Bosses and their shots
const spriteAlienBoss = new Sprite(935, 259, 320, 150);
const spriteAlienBossShot = new Sprite(1193, 159, 35, 50);

const spriteTheBigShipBoss = new Sprite(2836, 0, 395, 356);
const spriteTheBigShipBossShot = new Sprite(1248, 159, 35, 50);

const spriteGalacticBoatLeftBoss = new Sprite(3285, 29, 519, 260);
const spriteGalacticBoatRightBoss = new Sprite(3285, 313, 519, 260);
const spriteGalacticBoatBossShot = new Sprite(1011, 451, 50, 50);
const spriteGalacticBoatBossOrb = new Sprite(1090, 463, 40, 40);

const spriteCuteCat = new Sprite(2989, 430, 89, 83);