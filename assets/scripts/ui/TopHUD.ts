import { _decorator, Component, director, Label, Node } from 'cc';
import { GamePlay } from '../core/GamePlay';
const { ccclass, property } = _decorator;

@ccclass('TopHUD')
export class TopHUD extends Component {
    @property(Label)
    scoreLabel: Label = null!;

    @property(Label)
    livesLabel: Label = null!;

    @property(Node)
    playButton: Node = null!;

    isPaused: Boolean = false;


    protected start(): void {
        this.updateScore(0);
        this.updateLives(3);
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
        GamePlay.instance.restartGame();
    }
    onPause() {
        if (!this.isPaused) {
            this.isPaused = true
            director.pause()
        }
        else {
            this.isPaused = false
            director.resume()
        }
    }

}

