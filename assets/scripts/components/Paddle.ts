import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
import { GameConstants } from '../utilis/Constants';
import { GamePlay } from '../core/GamePlay';

const { ccclass } = _decorator;

@ccclass('Paddle')
export class Paddle extends Component {
    private _targetPosition: Vec3 = new Vec3();

    protected start(): void {
        this._targetPosition = this.node.getPosition().clone();

    }


    public move(direction: number): void {
        const uiTransform = this.node.getComponent(UITransform)!;
        const paddleHalfWidth = uiTransform.width / 2;

        const gamePlayInstance = GamePlay.instance;
        const currentPos = this.node.getPosition();
        const newX = currentPos.x + direction * GameConstants.PADDLE_SPEED;

        // Clamp paddle center to valid bounds (edges should stay inside game area)
        const leftBound = gamePlayInstance.gameAreaLeft + paddleHalfWidth;
        const rightBound = gamePlayInstance.gameAreaRight - paddleHalfWidth;
        const clampedX = Math.max(leftBound, Math.min(newX, rightBound));

        this.node.setPosition(clampedX, currentPos.y, currentPos.z);
    }




    public setPosition(x: number): void {
        const currentPos = this.node.getPosition();
        const gamePlayInstance = GamePlay.instance;
        const width = this.node.getComponent(UITransform)!.width;

        const clampedX = Math.max(
            gamePlayInstance.gameAreaLeft + width / 2,
            Math.min(gamePlayInstance.gameAreaRight - GameConstants.PADDLE_WIDTH / 2, x)
        );
        this.node.setPosition(clampedX, currentPos.y, currentPos.z);
    }

    public getWidth(): number {
        return GameConstants.PADDLE_WIDTH;
    }
}