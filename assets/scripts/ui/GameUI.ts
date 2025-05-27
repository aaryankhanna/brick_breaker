import { _decorator, Component, director, Prefab, instantiate } from 'cc';
import { GameState } from '../utilis/Constants';

const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {

    @property(Prefab)
    gameOverPanel: Prefab = null!;

    @property(Prefab)
    victoryPanel: Prefab = null!;

    public onStateChanged(newState: GameState): void {
        switch (newState) {
            case GameState.GAME_OVER:
                const gameOver = instantiate(this.gameOverPanel);
                this.node.addChild(gameOver);
                director.pause()
                break;
            case GameState.VICTORY:
                const victory = instantiate(this.victoryPanel);
                this.node.addChild(victory);
                director.pause()
                break;
        }
    }
}