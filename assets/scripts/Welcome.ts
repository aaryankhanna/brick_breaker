import { _decorator, Component, Node, tween, Vec3, UIOpacity, Label, EventTouch, input, Input, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Welcome')
export class Welcome extends Component {

    @property(Label)
    startLabel: Label = null;

    private isClicked = false;
    private labelTween = null;

    start() {
        this.playIdleBounce();

        // Listen for click on the label's node
        this.startLabel.node.on(Input.EventType.TOUCH_END, this.onStartClick, this);
    }

    playIdleBounce() {
        // Bob up and down loop
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
        if (this.isClicked) return; // Prevent multiple triggers
        this.isClicked = true;

        // Stop bounce animation
        if (this.labelTween) {
            this.labelTween.stop();
        }

        const labelNode = this.startLabel.node;
        const uiOpacity = labelNode.getComponent(UIOpacity);
        if (!uiOpacity) {
            console.warn('UIOpacity component not found on label node');
            return;
        }

        // Animate: scale down + fade out + move slightly
        tween(labelNode)
            .parallel(
                tween(labelNode).to(1, { scale: new Vec3(0.4, 0.4, 1) }, { easing: 'quadOut' }),
                tween(labelNode).to(1, { position: new Vec3(0, 20, 0) }, { easing: 'quadOut' }),
                tween(uiOpacity).to(1, { opacity: 0 }, { easing: 'sineOut' })
            )
            .call(() => {
                labelNode.active = false;
                this.node.active = false;
                // You can trigger a scene change or UI transition here if needed
            })
            .start();
    }
}
