import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {

    constructor(config) {
        super('PauseScene', config);

        this.menu = [
            {
                scene: 'PlayScene',
                text: 'Resume'
            },
            {
                scene: 'MenuScene',
                text: 'Exit'
            }
        ];
    }

    create() {
        super.create();

        this.createMenu(this.menu, (menuItem) => this.setupMenuEvents(menuItem));
    }

    setupMenuEvents(menuItem) {
        const textGO = menuItem.textGO;
        textGO.setInteractive()
            .on('pointerover', () => {
                textGO.setStyle({ fill: '#FF0' })
            })
            .on('pointerout', () => {
                textGO.setStyle({ fill: '#FFF' })
            })
            .on('pointerdown', () => {
                if (menuItem.scene && menuItem.text === 'Resume') {
                    this.scene.stop();
                    this.scene.resume('PlayScene');
                } else if (menuItem.scene && menuItem.text === 'Exit') {
                    this.scene.stop('PlayScene');
                    this.scene.start(menuItem.scene);
                }
            });
    }
}

export default PauseScene;