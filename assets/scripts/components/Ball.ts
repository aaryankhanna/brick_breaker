import { _decorator, Component, Node, Vec3, RigidBody2D, Vec2, Collider2D, Contact2DType, ERigidBody2DType } from 'cc';
import { GameConstants } from '../utilis/Constants';
import { Brick } from './Brick';
import { GamePlay } from '../core/GamePlay';

const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends Component {
    private _rigidBody: RigidBody2D = null!;
    private _isAttached = true;
    private _attachedPaddle: Node = null!;
    private _velocity: Vec2 = new Vec2();

    protected onLoad(): void {

    }
    protected onEnable(): void {
        this.setupCollision();
    }
    protected start(): void {
        this._velocity.set(0, GameConstants.BALL_SPEED);
    }

    private setupCollision(): void {
        const collider = this.node.getComponent(Collider2D)!;
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }

    public attachToPaddle(paddle: Node): void {
        this._rigidBody = this.node.getComponent(RigidBody2D)!;
        this._isAttached = true;
        this._attachedPaddle = paddle;
        this._rigidBody.linearVelocity = Vec2.ZERO;
    }

    public launch(): void {
        if (!this._isAttached) return;

        this._isAttached = false;
        this._attachedPaddle = null!;

        const angle = Math.random() * 60 - 30;
        const radians = angle * Math.PI / 180;
        const launchVelocity = new Vec2(
            Math.sin(radians) * GameConstants.BALL_SPEED,
            Math.cos(radians) * GameConstants.BALL_SPEED
        );

        this._rigidBody.linearVelocity = launchVelocity;
    }

    protected update(deltaTime: number): void {
        if (this._isAttached && this._attachedPaddle) {
            const paddlePos = this._attachedPaddle.getPosition();
            this.node.setPosition(paddlePos.x, paddlePos.y + 40, 0);
        } else {
            if (GamePlay.instance.livesLeft > 0) {
                this.checkBounds();
                this.maintainSpeed();
            }
        }
    }

    private checkBounds(): void {
        const pos = this.node.getPosition();
        const gamePlayInstance = GamePlay.instance;
        if (pos.y < gamePlayInstance.gameAreaBottom - 100) {
            GamePlay.instance.onBallLost();
            return;
        }

        if (pos.x <= gamePlayInstance.gameAreaLeft || pos.x >= gamePlayInstance.gameAreaRight) {
            this._rigidBody.linearVelocity = new Vec2(-this._rigidBody.linearVelocity.x, this._rigidBody.linearVelocity.y);
        }
        if (pos.y >= gamePlayInstance.gameAreaTop) {
            this._rigidBody.linearVelocity = new Vec2(this._rigidBody.linearVelocity.x, -Math.abs(this._rigidBody.linearVelocity.y));
        }
    }

    private maintainSpeed(): void {
        const velocity = this._rigidBody.linearVelocity;
        const speed = velocity.length();

        if (speed > 0 && Math.abs(speed - GameConstants.BALL_SPEED) > 10) {
            velocity.normalize();
            velocity.multiplyScalar(GameConstants.BALL_SPEED);
            this._rigidBody.linearVelocity = velocity;
        }
    }

    private onCollisionEnter(selfCollider: Collider2D, otherCollider: Collider2D): void {
        const other = otherCollider.node;

        if (other.name.includes('Paddle')) {
            this.bounceOffPaddle(other);
        } else if (other.name.includes('Brick')) {
            this.bounceOffBrick(other);
        }
    }

    private bounceOffPaddle(paddle: Node): void {
        const ballPos = this.node.getPosition();
        const paddlePos = paddle.getPosition();
        const hitFactor = (ballPos.x - paddlePos.x) / (GameConstants.PADDLE_WIDTH / 2);

        const bounceAngle = hitFactor * 60;
        const radians = bounceAngle * Math.PI / 180;

        const newVelocity = new Vec2(
            Math.sin(radians) * GameConstants.BALL_SPEED,
            Math.abs(Math.cos(radians)) * GameConstants.BALL_SPEED
        );

        this._rigidBody.linearVelocity = newVelocity;
    }

    private bounceOffBrick(brick: Node): void {
        const velocity = this._rigidBody.linearVelocity.clone();
        this._rigidBody.linearVelocity = new Vec2(velocity.x, -velocity.y);

        const brickComponent = brick.getComponent(Brick);
        if (brickComponent) {
            brickComponent.onHit();
        }
    }
}