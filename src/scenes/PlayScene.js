import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');

        this.config = config;
        this.bird = null;
        this.pipes = null;

        this.score = 0;
        this.scoreText = '';

        this.pauseButton = null;
    }

    preload() {
        this.load.image('sky-bg', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('pause', 'assets/pause.png');
    }

    create() {
        this.createBackground();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPauseButton();
        this.handleInputs();
    }

    update(time, delta) {
        this.checkGameStatus();
    }

    createBackground() {
        this.add.image(this.config.width / 2, this.config.height / 2, 'sky-bg');
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.birdPosition.x, this.config.birdPosition.y, 'bird');
        this.bird.body.gravity.y = this.config.gravity;
        this.bird.setCollideWorldBounds(true, false, false);
    }

    createPipes() {
        this.pipes = this.physics.add.group();
        for (let i = 0; i < this.config.noPipes; i++) {
            const upperPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            const lowerPipe = this.pipes.create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);

            this.placePipe(upperPipe, lowerPipe);
        }
        this.pipes.setVelocityX(-200);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    createScore() {
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0');

        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && Number.parseInt(bestScoreText) || 0;
        this.add.text(16, 36, `Best Score: ${bestScore}`, {fill: '#000', fontSize: '12px'});
    }

    createPauseButton() {
        this.pauseButton = this.add.image(this.config.width - 16, this.config.height - 16, 'pause')
            .setScale(2)
            .setOrigin(1, 1)
            .setInteractive()
            .on('pointerdown', function () {
                this.physics.pause();
                this.scene.pause();
            }, this);

    }

    handleInputs() {
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    checkGameStatus() {
        if (this.bird.y - this.bird.height / 2 <= 0 || this.bird.y + this.bird.height / 2 >= this.config.height) {
            this.gameOver();
        }
        this.recyclePipes();
    }

    placePipe(uPipe, lPipe) {
        const rightMostPipe = this.getRightMostPipe();
        const pipeHorizontalDistance = Phaser.Math.Between(...this.config.pipeHorizontalDistanceRange);
        const pipeVerticalDistance = Phaser.Math.Between(...this.config.pipeVerticalDistanceRange);
        const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);

        uPipe.x = lPipe.x = rightMostPipe.x + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;
        lPipe.y = uPipe.y + pipeVerticalDistance;
    }

    flap() {
        this.bird.body.velocity.y = -this.config.flap;
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    gameOver() {
        // this.bird.x = this.config.width * 0.1;
        // this.bird.y = this.config.height / 2;
        // this.bird.body.velocity.y = 0;
        this.physics.pause();
        this.bird.setTint(0xff0000);

        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && Number.parseInt(bestScoreText);

        if (!bestScore || this.score > bestScore) {
            localStorage.setItem('bestScore', this.score);
        }

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        });
    }

    recyclePipes() {
        let uPipe, lPipe;
        this.pipes.getChildren().forEach(function (pipe) {
            if (pipe.getBounds().right <= 0) {
                if (!uPipe) {
                    uPipe = pipe;
                } else if (!lPipe) {
                    lPipe = pipe;
                }
            }
        });

        if (uPipe && lPipe) {
            this.placePipe(uPipe, lPipe);
            this.increaseScore();
        }
    }

    getRightMostPipe() {
        let rightMostPipe = this.pipes.getChildren()[0];
        let rightMostX = rightMostPipe.x;

        this.pipes.getChildren().forEach(function (pipe) {
            if (pipe.x > rightMostX) {
                rightMostX = pipe.x;
                rightMostPipe = pipe;
            }
        });

        return rightMostPipe;
    }
}

export default PlayScene;