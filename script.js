window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

    // Create OOP for Player
    class Player {
        constructor(game) {
                this.game = game;
                // position player
                this.collisionX = this.game.width * 0.5;
                this.collisionY = this.game.height * 0.5;
                this.collisionRadius = 50;
                this.speedX = 0;
                this.speedY = 0;
                this.dx = 0;
                this.dy = 0;
                this.speedModifier = 20;
            }
            // drawing the player: draw method
        draw(context) {
            // begin a new shape
            context.beginPath();
            // close a new shape: x, y, start radius,  angle the radius
            // context.arc(100, 100, 50, 0, Math.PI * 2);
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
            context.beginPath();
            context.moveTo(this.collisionX, this.collisionY); // will define starting x and y coordinates of the line
            context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.stroke();
        }

        update() {
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            const distance = Math.hypot(this.dy, this.dx);
            if (distance > this.speedModifier) {
                this.speedX = this.dx / distance || 0;
                this.speedY = this.dy / distance || 0;
            } else {
                this.speedX = 0;
                this.speedY = 0;
            }
            // this.collisionX = this.game.mouse.x;
            this.collisionX += this.speedX * this.speedModifier;
            this.collisionY += this.speedY * this.speedModifier;
        }
    }

    class Obstacle {
        constructor(game) {
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 60;
        }
        draw(context) {
            // begin a new shape
            context.beginPath();
            // close a new shape: x, y, start radius,  angle the radius
            // context.arc(100, 100, 50, 0, Math.PI * 2);
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
        }

    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.numberOfObstacles = 10;
            this.obstacles = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            // event listeners for mouse movement
            canvas.addEventListener('mousedown', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
                console.log(this.mouse.x, this.mouse.y); //offsetx, y from properties when chrome tool open
            });
            canvas.addEventListener('mouseup', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            canvas.addEventListener('mousemove', e => {
                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                    console.log(this.mouse.x);
                }
            });
        }
        render(context) {
            this.player.draw(context);
            this.player.update();
            this.obstacles.forEach(Obstacle => Obstacle.draw(context));
        }
        init() {
            // create random obstacle which is for loop 5 obstacles
            // for (let i = 0; i < this.numberOfObstacles; i++) {
            //     this.obstacles.push(new Obstacle(this));
            // }
            // create overlapping obstacle: circle packing or Brute force algorithm
            // it just tries over and over many times
            let attemps = 0;
            while (this.obstacles.length < this.numberOfObstacles && attemps < 500) {
                let testObstacle = new Obstacle(this);
                let overlap = false;
                console.log(testObstacle);
                // use circle collision detection formula
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collisionX - obstacle.collisionX;
                    const dy = testObstacle.collisionY - obstacle.collisionY;
                    const distance = Math.hypot(dy, dx);
                    const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;
                    if (distance < sumOfRadii) {
                        overlap = true;
                    }
                });
                if (!overlap) {
                    this.obstacles.push(testObstacle);
                }
                attemps++

            }
        }

    }

    const game = new Game(canvas);
    game.init();
    // game.render(ctx);
    console.log(game);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});