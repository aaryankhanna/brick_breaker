import { _decorator, Component, Node, Graphics, Vec2, Vec3, Color } from 'cc';
import { GameConstants } from '../utilis/Constants';

const { ccclass, property } = _decorator;

@ccclass('Trajectory')
export class Trajectory extends Component {
    @property(Graphics)
    graphics: Graphics = null!;

    @property
    dotCount: number = 15;

    @property
    dotSpacing: number = 30;

    protected onLoad(): void {
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics) || this.addComponent(Graphics);
        }
        this.hide();
    }

    public calculateTrajectory(startPos: Vec3, direction: Vec2): void {
        if (!this.graphics) return;

        this.graphics.clear();
        this.graphics.fillColor = new Color(255, 255, 255, 180);

        let currentPos = new Vec2(startPos.x, startPos.y);
        const velocity = direction.clone().normalize().multiplyScalar(GameConstants.BALL_SPEED);
        const timeStep = this.dotSpacing / GameConstants.BALL_SPEED;

        for (let i = 0; i < this.dotCount; i++) {
            // Draw dot
            this.graphics.circle(currentPos.x, currentPos.y, 3);
            this.graphics.fill();

            // Calculate next position
            currentPos.add(velocity.clone().multiplyScalar(timeStep));

            // Simple collision prediction (walls only)
            if (currentPos.x <= GameConstants.GAME_AREA_LEFT || currentPos.x >= GameConstants.GAME_AREA_RIGHT) {
                velocity.x = -velocity.x;
            }

            if (currentPos.y >= GameConstants.GAME_AREA_TOP) {
                break;
            }
        }
    }

    public show(): void {
        this.node.active = true;
    }

    public hide(): void {
        this.node.active = false;
        if (this.graphics) {
            this.graphics.clear();
        }
    }
}