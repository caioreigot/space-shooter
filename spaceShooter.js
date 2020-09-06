const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

// Game variables
let keys = {}, currentState, enemyInsertionSpeed = 65, meteorInsertionSpeed = 250, bossPhase = false,

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
            if (bossPhase == false)
                this.y -= this.upDownSpeed;
            // Do not pass the y axis of each boss
            else if ([75, 150, 225].indexOf(spaceship.score) >= 0) {
                if (spaceship.y >= 190)
                    this.y -= this.upDownSpeed;
            }
            else if (spaceship.score == 300) {
                if (spaceship.y >= 140)
                    this.y -= this.upDownSpeed;
            }

        }

        if (this.lifes == 0) {
            currentState = states.lose;
        }

        // Function responsible for increasing the difficulty according to the spaceship score and making changes depending on the score
        spaceshipScoreLevel();

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
        if (currentState == states.playing)
            // Instantiating a shot object if there are 5 or fewer shots on the screen
            if (this._shots.length <= 5) {
                this._shots.push({
                    x: spaceship.x + spaceship.width / 2 - 15,
                    y: spaceship.y,
                    width: this.width,
                    height: this.height
                });
            }
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
                    
                    // Loop to check if the bullet will hit any enemy aircraft (j)
                    for (let j = 0; j < enemySpaceship._enemys.length; j++) {
                        let enemyJ = enemySpaceship._enemys[j];

                        if (
                            shot.x + shot.width >= enemyJ.x 
                            && shot.x <= enemyJ.x + enemyJ.width 
                            && shot.y <= enemyJ.y + enemyJ.height
                            && shot.y + enemyJ.height >= enemyJ.y
                            ) {
                            this._shots.splice(i, 1);

                            // If the shot strikes the ship and your life is 0, remove the ship from the enemys array
                            enemyJ.lifes--;
                            if (enemyJ.lifes == 0) {
                                enemySpaceship._enemys.splice(j, 1)
                                spaceship.score++;
                            }
                        }
                        
                    }

                    // Loop to check if the bullet will hit any meteor (K)
                    for (let k = 0; k < meteor._meteors.length; k++) {
                        let meteorK = meteor._meteors[k];

                        // Colliding with meteors
                        if (
                            shot.x + shot.width >= meteorK.x 
                            && shot.x <= meteorK.x + meteorK.width 
                            && shot.y <= meteorK.y + meteorK.height
                            && shot.y + shot.height >= meteorK.y
                           ) {
                               this._shots.splice(i, 1);

                               // If the shot strikes the meteor, remove the meteor from the meteors array
                               meteorK.life--;
                               if (meteorK.life == 0) {
                                    meteor._meteors.splice(k, 1);
                               }
                           }

                    }

                    // Colliding with alien boss
                    if (
                        bossPhase == true && spaceship.score == 75
                        && shot.y <= alienBoss.y + alienBoss.height
                        && shot.x >= alienBoss.x
                        && shot.x <= alienBoss.x + alienBoss.width
                        ) {
                        alienBoss.lifes--;
                        this._shots.splice(i, 1);
                    }

                    // Colliding with The Big Ship boss
                    if (
                        bossPhase == true && spaceship.score == 150
                        && shot.y <= theBigShip.y + theBigShip.height - 100
                        && shot.x >= theBigShip.x
                        && shot.x <= theBigShip.x + theBigShip.width
                        ) {
                        theBigShip.lifes--;
                        this._shots.splice(i, 1);
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

},

enemySpaceship = {

    _enemys: [],
    
    width: 50,
    height: 40,
    speed: 2.7,
    lifes: 1,
    insertTime: 0,

    // Function responsible for inserting "enemy ships" in the _enemies array
    insert() {
        if (currentState == states.playing && bossPhase == false) {
            let totalPossibleScore = this._enemys.length + spaceship.score;

            // Stop coming enemy spaceships when the score gives the boss score
            if (
                spaceship.score < 75 && totalPossibleScore < 75 
                || spaceship.score > 75 && spaceship.score < 150 && totalPossibleScore < 150
                || spaceship.score > 150 && spaceship.score < 225 && totalPossibleScore < 225
                || spaceship.score > 225 && spaceship.score < 300 && totalPossibleScore < 300
                || spaceship.score > 300
                ) {
                this._enemys.push({
                    x: 5 + Math.floor(840 * Math.random()),
                    y: -20,
                    width: this.width,
                    height: this.height,
                    lifes: this.lifes
                })
        
                // Related to the time each ship will appear
                this.insertTime = enemyInsertionSpeed + Math.floor(21 * Math.random());
            }
        }
    },

    update() {
        if (this.insertTime == 0)
            this.insert();
        else
            this.insertTime--; 

        // Loop to check if each enemy spaceships will pass the screen, damaging the spaceship and removing itself from the array
        for (let i = 0; i < this._enemys.length; i++) {

            let enemy = this._enemys[i];
            enemy.y += this.speed;

            if (enemy.y > canvas.height) {
                this._enemys.splice(i, 1);
                spaceship.lifes--;
            }

        }

    },

    draw() {
        for (let i = 0; i < this._enemys.length; i++) {
            let enemy = this._enemys[i];

            if (spaceship.score < 75)
                spriteAlienEnemySpaceship.draw(enemy.x, enemy.y);
            else if (spaceship.score > 75 && spaceship.score < 150)
                sprite2PhaseEnemySpaceship.draw(enemy.x, enemy.y);
            else if (spaceship.score > 150 && spaceship.score < 225)
                sprite3PhaseEnemySpaceship.draw(enemy.x, enemy.y);
            else
                sprite4PhaseEnemySpaceship.draw(enemy.x, enemy.y);
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
    leftRightSpeed: 0.5,

    insertTime: 0,
    // Shots to break the meteor
    life: 5,

    // Function responsible for inserting meteors in the _meteors array
    insert() {
        if (currentState == states.playing && currentState != states.lose) {
            this._meteors.push({
                x: 5 + Math.floor(840 * Math.random()),
                y: -20,
                width: this.width,
                height: this.height,
                life: this.life,
                // Picking up the meteor sprite randomly
                sprite: this._sprites[Math.floor(this._sprites.length * Math.random())]
            })
    
            // Related to the time each meteor will appear
            this.insertTime = meteorInsertionSpeed + Math.floor(61 * Math.random());
        }
    },

    update() {
        if (this.insertTime == 0) {
            this.insert();
        } else {
            this.insertTime--; 
        }

        // Loop between all meteors on the screen
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
                spaceship.lifes--;
            }

        }

        // The 3rd (score > 150) meteors move messy on the X axis
        if (spaceship.score > 150) {
            for (let i = 0; i < this._meteors.length; i++) {
                let meteor = this._meteors[i];
                
                if (meteor.x > canvas.width / 2 - meteor.width)
                    meteor.x -= this.leftRightSpeed;
                else
                    meteor.x += this.leftRightSpeed;
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

lifeBonus = {

    _lifes: [],

    width: 30,
    height: 30,
    downSpeed: 1,
    insertTime: 2000,

    // Function responsible for inserting life bonus in the _lifes array
    insert() {
        if (currentState == states.playing && currentState != states.lose) {
            this._lifes.push({
                x: 5 + Math.floor(840 * Math.random()),
                y: -20,
                width: this.width,
                height: this.height,
            })
    
            // Related to the time each life bonus will appear
            this.insertTime = 2000 + Math.floor(61 * Math.random());
        }
    },

    update() {
        if (this.insertTime == 0 && bossPhase == false) {
            this.insert();
        } else {
            this.insertTime--; 
        }

        for (let i = 0; i < this._lifes.length; i++) {

            let life = this._lifes[i];
            life.y += this.downSpeed;

            // If the life leaves the screen, remove it from the array
            if (life.y > canvas.height) {
                this._lifes.splice(i, 1);
            } // If the life collides with the spaceship, take life from it and remove it from the array
            else if (
                spaceship.x + spaceship.width >= life.x 
                && spaceship.x <= life.x + life.width 
                && spaceship.y <= life.y + life.height 
                && spaceship.y + spaceship.height >= life.y
                ) {
                this._lifes.splice(i, 1);
                if (spaceship.lifes < 3) {
                    spaceship.lifes ++;
                }
            }

        }

    },

    draw() {
        for (let i = 0; i < this._lifes.length; i++) {
            let life = this._lifes[i];
            
            // Drawing the life sprite randomly that was generated by the object in insert()
            spriteLifeBonus.draw(life.x, life.y);
        }
    },

    clean() {
        this._lifes = [];
    },

    resetInsertTime() {
        this.insertTime = 2000;
    }

},

// All boss objects

// Boss of score 75
alienBoss = {

    _shots: [],
    shotInsertTime: 0,

    x: canvas.width / 2 - 160,
    y: -200,
    width: 320,
    height: 150,
    lifes: 120,
    speed: 0.5,
    
    update() {
        if (this.y <= canvas.width / 2 - this.height - 280) {
            this.lifes = 120; // To prevent the player from spamming shots before the boss arrives and killing him
            this.y += this.speed;
        } else {
            // When he stops, start shooting  
            if (this.shotInsertTime == 0) {
                // Boss shot object
                this._shots.push({
                    x: alienBoss.x + Math.floor(290 * Math.random()),
                    y: alienBoss.y + alienBoss.height,
                    width: 35,
                    height: 50,
                    speed: 4.2,
                });

                this.shotInsertTime = 42;

            } else {
                this.shotInsertTime--;
            }

            // Loop all bullets fired from the alien boss
            for (let i = 0; i < this._shots.length; i++) {
                let alienBossShot = this._shots[i];

                alienBossShot.y += alienBossShot.speed;
                if (alienBossShot.y >= canvas.height) {
                    this._shots.splice(i, 1);
                }

                // Checking collision with the spaceship
                if (
                    spaceship.x + spaceship.width >= alienBossShot.x 
                    && spaceship.x <= alienBossShot.x + alienBossShot.width 
                    && spaceship.y <= alienBossShot.y + alienBossShot.height 
                    && spaceship.y + spaceship.height >= alienBossShot.y
                    ) {
                    this._shots.splice(i, 1);
                    spaceship.lifes--;
                }

            } // loop end

        }

        if (this.lifes == 0) {
            resetSpeed();

            // Decrease the speed for the player to read the warning
            enemySpaceship.insertTime = 200;
            enemyInsertionSpeed = 200; 
            meteorInsertionSpeed = 300;

            lifeBonus.insert();

            enemySpaceship.lifes = 2;
            spaceship.score++;
            
            bossPhase = false;
        }

    },

    draw() {
       spriteAlienBoss.draw(this.x, this.y);

        if (this._shots.length != 0) {
            for (i in this._shots) {

                let alienBossShot = this._shots[i];
                spriteAlienBossShot.draw(alienBossShot.x, alienBossShot.y);

            }
        }
    },

    resetBoss() {
        this.x = canvas.width / 2 - 160;
        this.y = -200;
        this._shots = [];
    }

},

// Boss of score 150
theBigShip = {
    
    _shots: [],
    shotInsertTime: 0,

    x: canvas.width / 2 - 197.5,
    y: -400,
    width: 395,
    height: 356,
    lifes: 150,
    downSpeed: 0.5,
    leftRightSpeed: 3,
    dirX: -1,
    
    update() {
        if (this.y <= canvas.width / 2 - this.height - 250) {
            this.lifes = 150; // To prevent the player from spamming shots before the boss arrives and killing him
            this.y += this.downSpeed;
        } else {
            // When he stops, start shooting and move from left to right, and vice versa
            this.x += this.leftRightSpeed * this.dirX;
            if (this.x <= 0)
                this.dirX = 1;
            else if (this.x >= canvas.width - this.width)
                this.dirX = -1;

            if (this.shotInsertTime == 0) {
                // Boss shot object
                this._shots.push({
                    x: theBigShip.x + Math.floor(290 * Math.random()),
                    y: theBigShip.y + theBigShip.height,
                    width: 35,
                    height: 50,
                    speed: 4.2,
                });

                this.shotInsertTime = 42;

            } else {
                this.shotInsertTime--;
            }

            // Loop all bullets fired from the theBigShip boss
            for (let i = 0; i < this._shots.length; i++) {
                let theBigShipShot = this._shots[i];

                theBigShipShot.y += theBigShipShot.speed;
                if (theBigShipShot.y >= canvas.height) {
                    this._shots.splice(i, 1);
                }

                // Checking cCollision with the spaceship
                if (
                    spaceship.x + spaceship.width >= theBigShipShot.x 
                    && spaceship.x <= theBigShipShot.x + theBigShipShot.width 
                    && spaceship.y <= theBigShipShot.y + theBigShipShot.height 
                    && spaceship.y + spaceship.height >= theBigShipShot.y
                    ) {
                    this._shots.splice(i, 1);
                    spaceship.lifes--;
                }

            }

        }

        if (this.lifes == 0) {
            resetSpeed();
            enemySpaceship.insertTime = 200;
            enemyInsertionSpeed = 200; 
            meteorInsertionSpeed = 300;

            lifeBonus.insert();
            spaceship.score++;
           
            bossPhase = false;
        }

    },

    draw() {
        spriteTheBigShipBoss.draw(this.x, this.y);

        if (this._shots.length != 0) {
            for (i in this._shots) {

                let theBigShipShot = this._shots[i];
                spriteTheBigShipBossShot.draw(theBigShipShot.x, theBigShipShot.y);

            }
        }
    },

    resetBoss() {
        this.x = canvas.width / 2 - 197.5;
        this.y = -400;
        this.dirX = -1;
    }

}

// Boss of score 225
galacticBoat = {
    
    _shots: [],
    shotInsertTime: 0,
    orbInsertTime: 300,

    x: canvas.width + 350,
    y: canvas.width / 2 - 243 - 260,
    width: 519,
    height: 260,
    lifes: 10,
    leftRightSpeed: 3,
    dirX: -1,
    
    update() {

        // Moving from left to right, and vice versa
        this.x += this.leftRightSpeed * this.dirX;

        if (this.x <= 0 - this.width - 50)
            this.dirX = 1;
        else if (this.x >= canvas.width + 50)
            this.dirX = -1;

        if (this.shotInsertTime == 0) {
            // Boss shoot object
            this._shots.push({
                x: galacticBoat.x + Math.floor(290 * Math.random()),
                y: galacticBoat.y + galacticBoat.height - 50,
                width: 50,
                height: 50,
                speed: 4.2,
            });

            this.shotInsertTime = 30;

        } else {
            this.shotInsertTime--;
        }

        // Orb the boat will drop
        if (this.orbInsertTime <= 0 && this.x > 0 && this.x < canvas.width - this.width) {
            orb.insert();
            this.orbInsertTime = 300;
        } else {
            this.orbInsertTime--;
        }

        // Loop all bullets fired from the galactic boat boss
        for (let i = 0; i < this._shots.length; i++) {
            let galaticBoatShot = this._shots[i];

            galaticBoatShot.y += galaticBoatShot.speed;
            if (galaticBoatShot.y >= canvas.height) {
                this._shots.splice(i, 1);
            }

            // Checking collision with the spaceship
            if (
                spaceship.x + spaceship.width >= galaticBoatShot.x 
                && spaceship.x <= galaticBoatShot.x + galaticBoatShot.width 
                && spaceship.y <= galaticBoatShot.y + galaticBoatShot.height 
                && spaceship.y + spaceship.height >= galaticBoatShot.y
                ) {
                this._shots.splice(i, 1);
                spaceship.lifes--;
            }

        }

        if (this.lifes == 0) {
            resetSpeed();
            enemySpaceship.insertTime = 200;
            enemyInsertionSpeed = 200; 
            meteorInsertionSpeed = 300;

            lifeBonus.insert();
            spaceship.score++;
            
            bossPhase = false;
        }

    },

    draw() {

        if (this.dirX == -1)
            spriteGalacticBoatLeftBoss.draw(this.x, this.y);
        if (this.dirX == 1)
            spriteGalacticBoatRightBoss.draw(this.x, this.y);

        if (this._shots.length != 0) {
            for (i in this._shots) {

                let theBigShipShot = this._shots[i];
                spriteGalacticBoatBossShot.draw(theBigShipShot.x, theBigShipShot.y);

            }
        }
    },

    resetBoss() {
        this.x = canvas.width + 350;
        this.y = canvas.width / 2 - 243 - 260;
        this.orbInsertTime = 300;
        this.lifes = 10;
        this._shots = [];
        orb.clean();
    }

}

// Related to galactic boat boss (score 225)
orb = {

    _orbs: [],

    width: 40,
    height: 40,
    speed: 3,
    
    insert() {
        if (spaceship.score == 225 && bossPhase == true) {
            this._orbs.push({
                x: galacticBoat.x + (galacticBoat.width / 2),
                y: galacticBoat.y + (galacticBoat.height / 2),
                width: 40,
                height: 40,
                speed: this.speed
            });
        }
    },

    update() {
        for (let i = 0; i < this._orbs.length; i++) {
            let orb = this._orbs[i];

            orb.y += orb.speed;
            // If leave the screen, remove it from the array
            if (orb.y >= canvas.height)
                this._orbs.splice(i, 1);
            
            // If it collides with the player, damage the boss and remove yourself from the array
            else if (
                spaceship.x + spaceship.width >= orb.x 
                && spaceship.x <= orb.x + orb.width 
                && spaceship.y <= orb.y + orb.height 
                && spaceship.y + spaceship.height >= orb.y
                ) {
                    this._orbs.splice(i, 1);
                    galacticBoat.lifes--;
                }

        }
    },

    draw() {
        for (let i = 0; i < this._orbs.length; i++) {
            let orb = this._orbs[i];

            spriteGalacticBoatBossOrb.draw(orb.x, orb.y);
        }
    },

    clean() {
        this._orbs = [];
    }

},

// Boss of score 300 (last boss)
cuteCat = {

    _walls: [],
    wallInsertTime: 0,
    wallRemovedCount: 0,

    x: canvas.width / 2 - 44.5,
    y: -200,
    width: 89,
    height: 83,
    lifes: 25,
    speed: 0.5,
    
    update() {
        if (this.y <= canvas.width / 2 - this.height - 340) {
            this.y += this.speed;
        } else {
            // When he stops, start "putting up the walls" 
            if (this.wallInsertTime == 0) {
                // Wall object
                this._walls.push({
                    x: 0,
                    y: cuteCat.y + cuteCat.height + 50,
                    width: 40 + Math.floor(780 * Math.random()),
                    height: 30,
                    speed: 2,
                });
                
                this._walls.push({
                    // (this._walls.lenght - 1) will get the array before this .push
                    x: 0 + this._walls[this._walls.length - 1].width + 140,
                    y: this._walls[this._walls.length - 1].y,
                    width: canvas.width - (0 + this._walls[this._walls.length - 1].width + 100),
                    height: 30,
                    speed: 2,
                });

                this.wallInsertTime = 115;

            } else {
                this.wallInsertTime--;
            }

            // Loop between all walls
            for (let i = 0; i < this._walls.length; i++) {
                let cuteCatWall = this._walls[i];

                cuteCatWall.y += cuteCatWall.speed;

                if (cuteCatWall.y >= canvas.height) {
                    this._walls.splice(i, 1);
                    
                    this.wallRemovedCount++;
                    if (this.wallRemovedCount % 2 == 0) {
                        this.lifes--;
                    }
                }

                // Collision with the spaceship
                if (
                    spaceship.x + spaceship.width >= cuteCatWall.x 
                    && spaceship.x <= cuteCatWall.x + cuteCatWall.width 
                    && spaceship.y <= cuteCatWall.y + cuteCatWall.height 
                    && spaceship.y + spaceship.height >= cuteCatWall.y
                    ) {
                    this._walls.splice(i, 1);
                    spaceship.lifes--;
                }

            }

        }

        if (this.lifes == 0) {
            resetSpeed();

            // Decrease the speed for the player to read the warning
            resetSpeed();
            enemySpaceship.insertTime = 200;
            enemyInsertionSpeed = 200; 
            meteorInsertionSpeed = 300;

            lifeBonus.insert();
            spaceship.score++;
            
            bossPhase = false;
        }

    },

    draw() {
       spriteCuteCat.draw(this.x, this.y);

        if (this._walls.length != 0) {
            for (i in this._walls) {

                let wall = this._walls[i];

                ctx.fillStyle = '#ea1d63';
                ctx.fillRect(wall.x, wall.y, wall.width, wall.height);

            }
        }
    },

    resetBoss() {
        this.x = canvas.width / 2 - 44.5;
        this.y = -200;
        this.lifes = 25;
        this.wallInsertTime = 0;
        this.wallRemovedCount = 0;
        this._walls = [];
    }

}

// Function that will run the game, drawing and updating information
function run() {
    update();
    draw();

    window.requestAnimationFrame(run); // loop
}

function update() {
    spaceship.update();
    enemySpaceship.update();

    lifeBonus.update();

    shot.update();

    if (spaceship.score != 300) {
        meteor.update();
    }

    if (bossPhase == true) {
        if (spaceship.score == 75) {
            alienBoss.update();
          } else if (spaceship.score == 150) {
            theBigShip.update();
          } else if (spaceship.score == 225) {
            orb.update();
            galacticBoat.update();
          } else if (spaceship.score == 300) {
              cuteCat.update();
          }
    }

      if (currentState == states.lose) {
            resetBosses();
            spaceship.resetPosition();

            enemySpaceship.clean();
            enemySpaceship.lifes = 1;
            meteor.clean();
            
            lifeBonus.clean();
            lifeBonus.resetInsertTime();
    
            bossPhase = false;

            if (spaceship.score > record) {
                // Storing the score in local storage, so as not to delete when closing the site or browser
                localStorage.setItem("record", spaceship.score);
                record = spaceship.score;
            }
      }

}

function draw() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    bg.draw(0, 0);

    ctx.fillStyle = '#fff';
    ctx.font = '50px Arial';
    
    if (currentState == states.play) {
        spritePlay.draw(canvas.width / 2 - spritePlay.width / 2, canvas.height / 2 - spritePlay.height / 2);
    }

    if (currentState == states.playing) {
        spaceship.draw();
        enemySpaceship.draw();

        lifeBonus.draw();
        meteor.draw();
        shot.draw();

        // Score
        ctx.fillText(spaceship.score, 30, 68);

        // Drawing boss if the score is related to him
        if (bossPhase == true) {
            if (spaceship.score == 75) {
                alienBoss.draw();
    
                ctx.fillStyle = '#ff0000';
                ctx.fillText(alienBoss.lifes, 30, 570)
    
            } else if (spaceship.score == 150) {
                theBigShip.draw();
    
                ctx.fillStyle = '#ff0000';
                ctx.fillText(theBigShip.lifes, 30, 570)
    
            } else if (spaceship.score == 225) {
                orb.draw();
                galacticBoat.draw();
    
                ctx.fillStyle = '#ff0000';
                ctx.font = '25px Arial';
                ctx.fillText(galacticBoat.lifes + ' orbs remaining', 30, 570)
    
            } else if (spaceship.score == 300) {
                cuteCat.draw();
    
                ctx.fillStyle = '#ff0000';
                ctx.font = '25px Arial';
                ctx.fillText('dodge ' + cuteCat.lifes + ' more obstacles', 30, 570)
            }
    
        }
        
        // Warning that enemies have +1 health
        if (spaceship.score > 75 && spaceship.score <= 77) {
            ctx.fillStyle = '#ff0000';
            ctx.font = '30px Arial';
            ctx.fillText('Enemies now have +1 life!', canvas.width - 620, 280);
            ctx.fillText('Shoot them twice', 340, 320);
        }

        // Remove the message when the boss stops (when cuteCat.y == 27.5)
        if (spaceship.score == 300 && cuteCat.y != 27.5) {
            ctx.fillStyle = '#ff0000';
            ctx.font = '50px Arial';
            ctx.fillText('FINAL BOSS', canvas.width - 590, 310);
        } else if (spaceship.score > 300 && spaceship.score <= 303) {
            ctx.fillStyle = '#ff0000';

            ctx.font = '50px Arial';
            ctx.fillText('INFINITE TIME', canvas.width - 620, 280);
            
            ctx.font = '25px Arial';
            ctx.fillText('Congratulations! you have beaten all the bosses!', canvas.width - 720, 320);
        }

    }

    // Drawing spaceship life
    if (currentState != states.play) {
        if (spaceship.lifes == 3)
            sprite3Lifes.draw(730, 20);
        else if (spaceship.lifes == 2)
            sprite2Lifes.draw(730, 20);
        else if (spaceship.lifes == 1)
            sprite1Lifes.draw(730, 20);
        else
            sprite0Lifes.draw(730, 20);
    }

    // When losing, show the scoreboard, with the player's score and his record
    if (currentState == states.lose) {
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
    enemyInsertionSpeed = 65;
    meteorInsertionSpeed = 250;
    enemySpaceship.speed = 2.7;
}

// Function responsible for increasing the difficulty according to the spaceship score and making changes depending on the score
function spaceshipScoreLevel() {
    // "Rest" time after killing the boss (3 points)
    if ([78, 153, 228, 303].indexOf(spaceship.score) >= 0) {
        resetSpeed();
    }

    // Increasing enemy and meteor insertion time (difficulty)
    if ([25, 100, 175, 250, 325].indexOf(spaceship.score) >= 0) {
        enemyInsertionSpeed = 62;
        meteorInsertionSpeed = 235;
    }

    if ([50, 125, 200, 275, 350].indexOf(spaceship.score) >= 0) {
        enemyInsertionSpeed = 60;
        meteorInsertionSpeed = 220;
    }

    if ([75, 150, 225, 300].indexOf(spaceship.score) >= 0) {
        bossPhase = true;
        
        if (spaceship.score == 300)
            meteor.clean();

        // resetSpeed​​() is called when the boss dies
    }

    // With this (if spaceship.score > 350) the program will only read this if, and not the if and else if below
    if (spaceship.score > 350) {
        if (spaceship.score == 375) {
            enemyInsertionSpeed = 52;
            enemySpaceship.speed = 3.2;
        } else if (spaceship.score == 450) {
            enemyInsertionSpeed = 47;
            enemySpaceship.speed = 3.5;
        } else if (spaceship.score == 500) {
            enemyInsertionSpeed = 42;
        }
    }

}

// Reset boss positions and variables when dying
function resetBosses() {
    alienBoss.resetBoss();
    theBigShip.resetBoss();
    galacticBoat.resetBoss();
    cuteCat.resetBoss();
}

// Event listeners
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

// Main function, called for the first time to make initial settings
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
    
    // Function that will run the game, drawing and updating information
    run();
}

main();
