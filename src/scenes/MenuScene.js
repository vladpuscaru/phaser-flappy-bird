import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {

    constructor(config) {
        super('MenuScene', config);

        this.menu = [
            {
                scene: 'PlayScene',
                text: 'Play'
            },
            {
                scene: 'ScoreScene',
                text: 'Score'
            },
            {
                scene: null,
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
                menuItem.scene && this.scene.start(menuItem.scene);

                if (menuItem.text === 'Exit') {
                    this.game.destroy(true);
                }
            });
    }
}

export default MenuScene;