import { _decorator, Component, Node, Label, Button, director } from 'cc';
import { GameManager } from '../core/GameManager';
import { GameState } from '../utilis/Constants';


const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    @property(Label)
    scoreLabel: Label = null!;

    @property(Label)
    livesLabel: Label = null!;

    @property(Node)
    gameOverPanel: Node = null!;

    @property(Node)
    victoryPanel: Node = null!;

    isPaused: Boolean = false;


    protected start(): void {
        this.updateScore(0);
        this.updateLives(3);
    }


    public updateScore(score: number): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${score}`;
        }
    }

    public updateLives(lives: number): void {
        if (this.livesLabel) {
            this.livesLabel.string = `Lives: ${lives}`;
        }
    }

    public onStateChanged(newState: GameState): void {
        if (this.gameOverPanel.active || this.victoryPanel.active) {
            return
        }
        switch (newState) {
            case GameState.GAME_OVER:
                this.gameOverPanel.active = true;
                director.pause()
                break;
            case GameState.VICTORY:
                this.victoryPanel.active = true;
                director.pause()
                break;
        }
    }

    onRestartClick(): void {
        console.log("restart clicked");
        this.gameOverPanel.active = false;
        this.victoryPanel.active = false;
        GameManager.instance.restartGame();
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