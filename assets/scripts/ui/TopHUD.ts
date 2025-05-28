import { _decorator, Component, director, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { GamePlay } from '../core/GamePlay';
import { GameManager } from '../core/GameManager';
import { GameConstants } from '../utilis/Constants';
const { ccclass, property } = _decorator;

@ccclass('TopHUD')
export class TopHUD extends Component {
    @property(Label)
    scoreLabel: Label = null!;

    @property(Label)
    livesLabel: Label = null!;

    @property(Node)
    playButton: Node = null!;

    @property(SpriteFrame)
    buttonSprite: SpriteFrame[] = []!;

    @property(Node)
    stateLabel: Node = null!;

    @property(Prefab)
    infoPanel: Prefab = null!;

    isPaused: Boolean = false;


    protected start(): void {
        this.updateScore(0);
        this.updateLives(GameConstants.LIVES);
        GameManager.instance.stateLabel = this.stateLabel;
    }


    public updateScore(score: number): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = `${score}`;
        }
    }

    public updateLives(lives: number): void {
        if (this.livesLabel) {
            this.livesLabel.string = `${lives}`;
        }
    }
    update(deltaTime: number) {

    }
    onRestartClick(): void {
        GameManager.instance.restartGame();
    }
    onPause() {
        if (!this.isPaused) {
            this.isPaused = true
            this.playButton.getComponent(Sprite).spriteFrame = this.buttonSprite[1];
            this.stateLabel.active = true;
            director.pause()
        }
        else {
            this.isPaused = false
            this.stateLabel.active = false;

            this.playButton.getComponent(Sprite).spriteFrame = this.buttonSprite[0];

            director.resume()
        }
    }
    onInfoClick() {
        director.pause();
        const infoInstance = instantiate(this.infoPanel);
        GameManager.instance.uiNode.addChild(infoInstance);
    }
}

