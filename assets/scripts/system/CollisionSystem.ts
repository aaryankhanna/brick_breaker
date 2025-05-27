import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('CollisionSystem')
export class CollisionSystem extends Component {
    private _gameManager: GameManager = null!;

    public initialize(gameManager: GameManager): void {
        this._gameManager = gameManager;
        this.setupCollisionCallbacks();
    }

    private setupCollisionCallbacks(): void {
        // This system can be used for global collision handling
        // Individual components handle their own collisions directly
    }

    public handleBallBrickCollision(ball: Node, brick: Node): void {
        // Handle specific collision logic if needed
        const brickComponent = brick.getComponent('Brick');
        if (brickComponent) {
            (brickComponent as any).onHit();
        }
    }

    public handleBallPaddleCollision(ball: Node, paddle: Node): void {
        // Handle specific collision logic if needed
        const ballComponent = ball.getComponent('Ball');
        if (ballComponent) {
            (ballComponent as any).bounceOffPaddle(paddle);
        }
    }

    public handleBallWallCollision(ball: Node, wall: string): void {
        // Handle wall collisions
        const ballComponent = ball.getComponent('Ball');
        if (ballComponent) {
            (ballComponent as any).handleWallCollision(wall);
        }
    }
}