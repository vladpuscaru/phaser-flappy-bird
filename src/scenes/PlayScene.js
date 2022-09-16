import BaseScene from "./BaseScene";

class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config);

        this.bird = null;
        this.pipes = null;

        this.score = 0;
        this.scoreText = '';

        this.paused = false;

        this.currentDifficuly = 'easy';
        this.difficulties = {
            easy: {
                pipeHorizontalDistanceRange: [400, 550],
                pipeVerticalDistanceRange: [200, 400],
                color: 0xff0000
            },
            normal: {
                pipeHorizontalDistanceRange: [280, 330],
                pipeVerticalDistanceRange: [140, 190],
                color: 0x00ff00
            },
            hard: {
                pipeHorizontalDistanceRange: [250, 310],
                pipeVerticalDistanceRange: [120, 170],
                color: 0x0000ff
            }
        }
    }

    create() {
        super.create();

        this.currentDifficuly = 'easy';

        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPauseButton();
        this.handleInputs();
        this.listenToEvents();

        this.createBirdAnimation();

        this.difficultyText = this.add.text(this.config.width - 10, 10, `${this.currentDifficuly.toUpperCase()}`).setOrigin(1, 0);
    }

    update(time, delta) {
        this.checkGameStatus();

        // Bird tilt - added by me
        this.bird.angle = Phaser.Math.Clamp(this.bird.body.velocity.y, -45, 45);
    }

    createBirdAnimation() {
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {
                start: 8,
                end: 15,
            }),
            frameRate: 8,
            repeat: -1 // infinitely
        });

        this.bird.play('fly');
    }

    listenToEvents() {
        if (this.pauseEvent) return;

        this.pauseEvent = this.events.on('resume', () => {
            this.initialTime = 3;
            this.countDownText = this.add.text(this.screenCenter.x, this.screenCenter.y, `Fly in ${this.initialTime}`, {fontSize: '32px'})
                .setOrigin(.5);

            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: () => this.countDown(),
                loop: true
            })

        });
    }

    countDown() {
        this.initialTime--;
        this.countDownText.setText(`Fly in ${this.initialTime}`);

        if (this.initialTime <= 0) {
            this.paused = false;
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
        }
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.birdPosition.x, this.config.birdPosition.y, 'bird')
            .setScale(3)
            .setBodySize(14, 10)
            .setFlipX(true);
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
        this.paused = false;
        this.add.image(this.config.width - 16, this.config.height - 16, 'pause')
            .setScale(2)
            .setOrigin(1, 1)
            .setInteractive()
            .on('pointerdown', () => {
                this.paused = true;
                this.physics.pause();
                this.scene.pause();
                this.scene.launch('PauseScene');
            }, this);

    }

    handleInputs() {
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    checkGameStatus() {
        if (this.bird.body.top <= 0 || this.bird.body.bottom >= this.config.height) {
            this.gameOver();
        }
        this.recyclePipes();
    }

    placePipe(uPipe, lPipe) {
        const rightMostPipe = this.getRightMostPipe();

        const {
            pipeHorizontalDistanceRange,
            pipeVerticalDistanceRange,
            color
        } = this.difficulties[this.currentDifficuly];

        const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
        const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
        const pipeVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - pipeVerticalDistance);

        uPipe.x = lPipe.x = rightMostPipe.x + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;
        lPipe.y = uPipe.y + pipeVerticalDistance;
    }

    flap() {
        if (!this.paused) {
            this.bird.body.velocity.y = -this.config.flap;
        }
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
            this.increaseDifficulty();
        }
    }

    increaseDifficulty() {
        if (this.score === 3) {
            this.currentDifficuly = 'normal';
        }

        if (this.score === 6) {
            this.currentDifficuly = 'hard';
        }

        this.difficultyText.setText(`${this.currentDifficuly.toUpperCase()}`);
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