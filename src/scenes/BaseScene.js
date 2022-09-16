import Phaser from "phaser";

class BaseScene extends Phaser.Scene {

    constructor(sceneName, config) {
        super(sceneName);
        this.config = config;
        this.screenCenter = {
            x: this.config.width / 2,
            y: this.config.height / 2
        }
    }

    create() {
        this.add.image(0, 0, 'sky-bg').setOrigin(0);

        if (this.config.canGoBack) {
            this.add.image(10, this.config.height - 10, 'back')
                .setOrigin(0, 1)
                .setScale(2)
                .setInteractive()
                .on('pointerdown', () => {
                   this.scene.start('MenuScene');
                });
        }
    }

    createMenu(menu, setupMenuEvents) {
        menu.forEach((item, index) => {
            item.textGO = this.add.text(this.screenCenter.x, this.screenCenter.y + 32 * (index + 1) - 32, item.text, { fontSize: '32px', fill: '#FFF' })
                .setOrigin(.5, 1);
            setupMenuEvents(item);
        });
    }
}

export default BaseScene;