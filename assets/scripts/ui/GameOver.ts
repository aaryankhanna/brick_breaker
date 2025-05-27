import { _decorator, Component, Label, Node } from 'cc';
import { GameManager } from '../core/GameManager';
import { GamePlay } from '../core/GamePlay';
import { GameConstants } from '../utilis/Constants';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends Component {
    @property(Label)
    brickLabel: Label = null!
    @property(Label)
    totalScore: Label = null
    @property(Label)
    bonus: Label = null!
    start() {
        this.init();

    }
    init() {
        if (this.node.name == "VictoryPanel") {
            this.bonus.string = `${GameConstants.BONUS}`;
            this.brickLabel.string = "BRICKS : " + `${GamePlay.instance.score}`;
            this.totalScore.string = "SCORE : " + (GamePlay.instance.score + GameConstants.BONUS);
        }
        else {
            this.totalScore.string = "SCORE : " + `${GamePlay.instance.score}`;
        }
    }
    restart() {
        GamePlay.instance.restartGame();
    }
    async home() {
        await GameManager.instance.destroyNodes();
        await GameManager.instance.showGameStartUI();
    }
    update(deltaTime: number) {

    }
}

