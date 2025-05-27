import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameConstants } from '../utilis/Constants';
import { GameManager } from '../core/GameManager';

const { ccclass } = _decorator;

@ccclass('Paddle')
export class Paddle extends Component {
    private _targetPosition: Vec3 = new Vec3();

    protected start(): void {
        this._targetPosition = this.node.getPosition().clone();
    }

    public move(direction: number): void {
        const currentPos = this.node.getPosition();
        const newX = currentPos.x + direction * GameConstants.PADDLE_SPEED;
        const gameManager = GameManager.instance;

        // Clamp to actual game area bounds
        const clampedX = Math.max(
            gameManager.gameAreaLeft + GameConstants.PADDLE_WIDTH / 2,
            Math.min(gameManager.gameAreaRight - GameConstants.PADDLE_WIDTH / 2, newX)
        );

        this._targetPosition.set(clampedX, currentPos.y, currentPos.z);
        this.node.setPosition(this._targetPosition);
    }

    public setPosition(x: number): void {
        const currentPos = this.node.getPosition();
        const gameManager = GameManager.instance;

        const clampedX = Math.max(
            gameManager.gameAreaLeft + GameConstants.PADDLE_WIDTH / 2,
            Math.min(gameManager.gameAreaRight - GameConstants.PADDLE_WIDTH / 2, x)
        );
        this.node.setPosition(clampedX, currentPos.y, currentPos.z);
    }

    public getWidth(): number {
        return GameConstants.PADDLE_WIDTH;
    }
}