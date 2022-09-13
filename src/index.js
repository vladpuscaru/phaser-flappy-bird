import * as Phaser from "phaser";

const WIDTH = 800;
const HEIGHT = 600;
const GRAVITY = 400;
const SPEED = 70;
const FLAP = 250;

const PIPES_TO_RENDER = 4;

let bird = null;
let pipes = null;

let pipeVerticalDistanceRange = [150, 250];
let pipeHorizontalDistanceRange = [380, 420];

let totalDelta = 0;

function preload() {
    this.load.image('sky-bg', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
}

function create() {
    this.add.image(WIDTH / 2, HEIGHT / 2, 'sky-bg');
    bird = this.physics.add.sprite(WIDTH * 0.1, HEIGHT / 2, 'bird');
    bird.body.gravity.y = GRAVITY;

    pipes = this.physics.add.group();
    for (let i = 0; i < PIPES_TO_RENDER; i++) {
        const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
        const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);

        placePipe(upperPipe, lowerPipe);
    }
    pipes.setVelocityX(-200);

    this.input.on('pointerdown', flap);
    this.input.keyboard.on('keydown_SPACE', flap);
}

// 60 FPS
function update(time, delta) {
    totalDelta += delta;
    if (totalDelta >= 1000) {
        totalDelta = 0;
    }

    if (bird.y - bird.height / 2 <= 0 || bird.y + bird.height / 2 > HEIGHT) {
        restart();
    }
}

function placePipe(uPipe, lPipe) {
    const rightMostPipe = getRightMostPipe();
    const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);
    const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(20, HEIGHT - 20 - pipeVerticalDistance);

    uPipe.x = lPipe.x = rightMostPipe.x + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;
    lPipe.y = uPipe.y + pipeVerticalDistance;
}

function getRightMostPipe() {
    let rightMostPipe = pipes.getChildren()[0];
    let rightMostX = rightMostPipe.x;

    pipes.getChildren().forEach(function (pipe) {
        if (pipe.x > rightMostX) {
            rightMostX = pipe.x;
            rightMostPipe = pipe;
        }
    });

    return rightMostPipe;
}

function flap() {
    bird.body.velocity.y = -FLAP;
}

function restart() {
    bird.x = WIDTH * 0.1;
    bird.y = HEIGHT / 2;
    bird.body.velocity.y = 0;
}

new Phaser.Game({
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: {
        preload,
        create,
        update
    }
});