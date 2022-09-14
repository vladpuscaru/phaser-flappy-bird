import * as Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const WIDTH = 800;
const HEIGHT = 600;
const GRAVITY = 600;
const FLAP = 300;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 }
const PIPES_TO_RENDER = 4;
const PIPE_VERTICAL_DISTANCE_RANGE = [150, 250];
const PIPE_HORIZONTAL_DISTANCE_RANCE = [380, 420];

const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    gravity: GRAVITY,
    flap: FLAP,
    birdPosition: BIRD_POSITION,
    noPipes: PIPES_TO_RENDER,
    pipeVerticalDistanceRange: PIPE_VERTICAL_DISTANCE_RANGE,
    pipeHorizontalDistanceRange: PIPE_HORIZONTAL_DISTANCE_RANCE
}


new Phaser.Game({
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    scene: [ new PlayScene(SHARED_CONFIG) ]
});