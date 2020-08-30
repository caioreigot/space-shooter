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