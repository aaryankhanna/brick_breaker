import { _decorator, Component, input, Input, EventTouch, Vec2 } from 'cc';
import { GameManager } from '../core/GameManager';
import { GamePlay } from '../core/GamePlay';

const { ccclass, property } = _decorator;

@ccclass('InputSystem')
export class InputSystem extends Component {
    private gamePlayInstance: GamePlay = null!;
    private _lastTouchPosition: Vec2 = new Vec2();
    private _isDragging: boolean = false;

    public initialize(gameManager: GamePlay): void {
        this.gamePlayInstance = gameManager;
        this.setupInput();
    }

    private setupInput(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onTouchStart(event: EventTouch): void {
        const touchPos = event.getUILocation();
        this._lastTouchPosition.set(touchPos.x, touchPos.y);
        this._isDragging = true;

        // Launch ball if attached to paddle
        if (this.gamePlayInstance.ball) {
            const ballComponent = this.gamePlayInstance.ball.getComponent('Ball');
            if (ballComponent && (ballComponent as any)._isAttached) {
                this.gamePlayInstance.launchBall();
            }
        }
    }

    private onTouchMove(event: EventTouch): void {
        if (!this._isDragging) return;

        const touchPos = event.getUILocation();
        const deltaX = touchPos.x - this._lastTouchPosition.x;

        // Convert screen space to world space movement
        const worldDelta = deltaX * 0.5; // Adjust sensitivity

        this.gamePlayInstance.movePaddle(worldDelta);
        this._lastTouchPosition.set(touchPos.x, touchPos.y);
    }

    private onTouchEnd(event: EventTouch): void {
        this._isDragging = false;
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}