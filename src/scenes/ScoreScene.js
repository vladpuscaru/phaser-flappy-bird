import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {

    constructor(config) {
        super('ScoreScene', { ...config, canGoBack: true });

        this.score = 0;
        this.scoreText = null;
    }

    create() {
        super.create();

        this.score = localStorage.getItem('bestScore') || 0;
        this.scoreText = this.add.text(this.config.width / 2, this.config.height / 2, `Best score: ${this.score}`).setOrigin(.5, 1);
    }
}

export default ScoreScene;