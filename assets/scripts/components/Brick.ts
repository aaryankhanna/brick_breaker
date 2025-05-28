import { _decorator, Component, Node, Sprite, Color, tween, Vec3, Collider2D, Contact2DType, RigidBody2D, ERigidBody2DType, SpriteFrame } from 'cc';
import { BrickHealth, BrickType } from '../utilis/Constants';
import { GamePlay } from '../core/GamePlay';


const { ccclass, property } = _decorator;

@ccclass('Brick')
export class Brick extends Component {

    @property(SpriteFrame)
    brickSprites: SpriteFrame[] = [];
    private _brickType: BrickType = BrickType.NORMAL;
    private _health: number = 1;
    private _isDestroyed: boolean = false;


    protected onLoad(): void {
        this.setupCollision();
    }

    private setupCollision(): void {
        const collider = this.getComponent(Collider2D);

        if (!collider) {
            return;
        }

        collider.on(Contact2DType.BEGIN_CONTACT, this.onBrickCollision, this);
    }

    private onBrickCollision(selfCollider: Collider2D, otherCollider: Collider2D): void {
        if (otherCollider.node.name.includes('Ball')) {
            this.onHit();
        }
    }

    public setBrickType(type: BrickType): void {
        this._brickType = type;
        if (type == BrickType.NORMAL) {
            this._health = BrickHealth.NORMAL;
        }
        else if (type == BrickType.STRONG) {
            this._health = BrickHealth.STRONG;

        }
        else {
            this._health = BrickHealth.UNBREAKABLE;
        }
        this.updateVisual();
    }

    private updateVisual(): void {
        var sprite = this.node.getComponent(Sprite);
        if (!sprite) return;

        switch (this._brickType) {
            case BrickType.NORMAL:
                sprite.spriteFrame = this.brickSprites[this._brickType]
                break;
            case BrickType.STRONG:
                sprite.spriteFrame = this.brickSprites[this._brickType]
                break;
            case BrickType.UNBREAKABLE:
                sprite.spriteFrame = this.brickSprites[this._brickType]
                break;
        }
    }

    public onHit(): void {
        if (this._isDestroyed || this._brickType === BrickType.UNBREAKABLE) {
            return;
        }
        console.log("health : ", this.health);

        this._health--;
        if (this._health <= 0) {
            this.destroyBrick();
        } else {
            // this.showHitEffect();
            this.updateVisual();
        }
    }

    private showHitEffect(): void {
        // Flash effect
        const originalSprite = this.node.getComponent(Sprite).spriteFrame;

        this.node.getComponent(Sprite).spriteFrame = this.brickSprites[3];

        tween(this.node.getComponent(Sprite).spriteFrame)
            .delay(0.1)
            .call(() => {
                this.node.getComponent(Sprite).spriteFrame = originalSprite;
            })
            .start();
    }

    private destroyBrick(): void {
        if (this._isDestroyed) return;

        this._isDestroyed = true;

        // Scale down animation
        tween(this.node)
            .to(0.2, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                GamePlay.instance.onBrickDestroyed(this.node);
                this.node.destroy();
            })
            .start();
    }

    public get brickType(): BrickType {
        return this._brickType;
    }

    public get health(): number {
        return this._health;
    }
}