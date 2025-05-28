import { _decorator, Component, Node, tween, Vec3, UIOpacity, Label, EventTouch, input, Input, EventMouse, Animation } from 'cc';
import { GameManager } from '../core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Welcome')
export class Welcome extends Component {

    @property(Label)
    startLabel: Label = null;

    private isClicked = false;
    private labelTween = null;

    start() {


        // Listen for click on the label's node
    }
    protected onEnable(): void {
    }
    onLoad() {
        this.playIdleBounce();
    }
    playIdleBounce() {
        const labelNode = this.startLabel.node;
        this.labelTween = tween(labelNode)
            .repeatForever(
                tween()
                    .to(0.5, { position: new Vec3(0, 10, 0) }, { easing: 'sineInOut' })
                    .to(0.5, { position: new Vec3(0, 0, 0) }, { easing: 'sineInOut' })
            )
            .start();
    }

    onStartClick() {
        console.log(this.isClicked);

        this.isClicked = true;

        const labelNode = this.startLabel.node;
        const uiOpacity = labelNode.getComponent(UIOpacity);

        if (!uiOpacity) {
            console.warn('UIOpacity component not found on label node');
            return;
        }

        tween(labelNode)
            .parallel(
                tween(labelNode).to(1, { scale: new Vec3(0.4, 0.4, 1) }, { easing: 'quadOut' }),
                tween(labelNode).to(1, { position: new Vec3(0, 20, 0) }, { easing: 'quadOut' }),
                tween(uiOpacity).to(1, { opacity: 0 }, { easing: 'sineOut' })
            )
            .call(() => {
                this.node.active = false;
                GameManager.instance.showGamePlay();
            })
            .start();
    }
}
