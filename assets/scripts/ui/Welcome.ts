import { _decorator, Component, Node, tween, Vec3, UIOpacity, Label, EventTouch, input, Input, EventMouse, Tween } from 'cc';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('Welcome')
export class Welcome extends Component {
    @property(Label)
    startLabel: Label = null;

    private isClicked = false;
    private labelTween = null;

    start() {
        console.log("onstart");
        this.setupEventListeners();
        this.playIdleBounce();
    }

    protected onEnable(): void {
        console.log('=== Welcome onEnable START ===');
        console.log('startLabel exists:', !!this.startLabel);
        console.log('startLabel.node exists:', !!(this.startLabel && this.startLabel.node));
        console.log('startLabel.node.active:', this.startLabel?.node?.active);

        // Reset state when enabled
        this.isClicked = false;

        // Ensure the label is visible and at correct position/scale
        this.resetLabelState();

        // Setup event listeners
        this.setupEventListeners();

        // Start animation
        this.playIdleBounce();

        console.log('=== Welcome onEnable END ===');
    }

    protected onDisable(): void {
        // Clean up when disabled
        this.cleanupEventListeners();
        this.stopAnimation();
    }

    private resetLabelState() {
        console.log('=== resetLabelState START ===');
        if (!this.startLabel || !this.startLabel.node) {
            console.error('startLabel or startLabel.node is null!');
            return;
        }

        const labelNode = this.startLabel.node;
        console.log('labelNode active:', labelNode.active);
        console.log('labelNode position before reset:', labelNode.position);
        console.log('labelNode scale before reset:', labelNode.scale);

        const uiOpacity = labelNode.getComponent(UIOpacity);
        console.log('UIOpacity component exists:', !!uiOpacity);
        console.log('UIOpacity value before reset:', uiOpacity?.opacity);

        // Reset position, scale, and opacity
        labelNode.position = new Vec3(0, 0, 0);
        labelNode.scale = new Vec3(1, 1, 1);

        if (uiOpacity) {
            uiOpacity.opacity = 255;
        }

        console.log('labelNode position after reset:', labelNode.position);
        console.log('labelNode scale after reset:', labelNode.scale);
        console.log('UIOpacity value after reset:', uiOpacity?.opacity);
        console.log('=== resetLabelState END ===');
    }

    private setupEventListeners() {
        console.log('=== setupEventListeners START ===');
        if (!this.startLabel || !this.startLabel.node) {
            console.error('Cannot setup event listeners - startLabel or node is null!');
            return;
        }

        // Remove existing listeners first
        this.cleanupEventListeners();

        // Add new listener
        this.startLabel.node.on(Input.EventType.TOUCH_END, this.onStartClick, this);
        console.log('Event listener added successfully');
        console.log('Node has listeners:', this.startLabel.node.hasEventListener(Input.EventType.TOUCH_END));
        console.log('=== setupEventListeners END ===');
    }

    private cleanupEventListeners() {
        if (this.startLabel && this.startLabel.node) {
            this.startLabel.node.off(Input.EventType.TOUCH_END, this.onStartClick, this);
        }
    }

    private stopAnimation() {
        if (this.labelTween) {
            this.labelTween.stop();
            this.labelTween = null;
        }
    }

    playIdleBounce() {
        console.log('=== playIdleBounce START ===');
        if (!this.startLabel || !this.startLabel.node) {
            console.error('Cannot start bounce - startLabel or node is null!');
            return;
        }

        // Stop any existing animation
        this.stopAnimation();

        const labelNode = this.startLabel.node;
        console.log('Starting bounce animation for node:', labelNode.name);
        console.log('Node active state:', labelNode.active);
        console.log('Node position before bounce:', labelNode.position);

        // Add a small delay to ensure the scene is fully ready
        this.scheduleOnce(() => {
            this.startTweenTest(labelNode);
        }, 0.1);
    }

    private startTweenTest(labelNode: Node) {
        console.log('Testing simple tween first...');

        try {
            // Test basic tween function
            const testTween = tween(labelNode);
            console.log('Basic tween created:', !!testTween);

            testTween
                .to(0.5, { position: new Vec3(0, 50, 0) })
                .call(() => {
                    console.log('Simple tween completed! Position:', labelNode.position);
                    this.startBounceLoop(labelNode);
                })
                .start();

            console.log('Test tween started');
        } catch (error) {
            console.error('Tween error:', error);
            // Fallback to manual animation
            this.manualBounce();
        }
    }

    private startBounceLoop(labelNode: Node) {
        console.log('Starting bounce loop...');
        try {
            this.labelTween = tween(labelNode)
                .repeatForever(
                    tween()
                        .to(0.5, { position: new Vec3(0, 10, 0) }, { easing: 'sineInOut' })
                        .to(0.5, { position: new Vec3(0, 0, 0) }, { easing: 'sineInOut' })
                )
                .start();

            console.log('Bounce animation started, tween object:', !!this.labelTween);
        } catch (error) {
            console.error('Bounce loop error:', error);
            this.manualBounce();
        }
        console.log('=== playIdleBounce END ===');
    }

    // Backup manual animation if tweens don't work
    private manualBounce() {
        if (!this.startLabel || !this.startLabel.node) return;

        console.log('Starting manual bounce animation as fallback');
        const labelNode = this.startLabel.node;
        const startPos = labelNode.position.clone();
        let time = 0;

        const updateBounce = () => {
            if (!labelNode || !labelNode.isValid) return;

            time += 1 / 60; // assuming 60fps
            const bounceHeight = 10;
            const speed = 2; // bounces per second

            const y = startPos.y + Math.sin(time * speed * Math.PI) * bounceHeight;
            labelNode.position = new Vec3(startPos.x, y, startPos.z);

            // Continue the animation
            this.scheduleOnce(updateBounce, 1 / 60);
        };

        updateBounce();
    }

    onStartClick() {
        console.log('=== START BUTTON CLICKED ===');
        console.log('isClicked state:', this.isClicked);

        if (this.isClicked) {
            console.log('Click ignored - already clicked');
            return; // Prevent multiple triggers
        }
        this.isClicked = true;

        // Stop bounce animation
        this.stopAnimation();

        const labelNode = this.startLabel.node;
        const uiOpacity = labelNode.getComponent(UIOpacity);

        if (!uiOpacity) {
            console.warn('UIOpacity component not found on label node');
            return;
        }

        console.log('Starting exit animation...');

        try {
            // Animate: scale down + fade out + move slightly
            tween(labelNode)
                .parallel(
                    tween(labelNode).to(1, { scale: new Vec3(0.4, 0.4, 1) }, { easing: 'quadOut' }),
                    tween(labelNode).to(1, { position: new Vec3(0, 20, 0) }, { easing: 'quadOut' }),
                    tween(uiOpacity).to(1, { opacity: 0 }, { easing: 'sineOut' })
                )
                .call(() => {
                    console.log('Exit animation complete, destroying node...');
                    this.node.destroy();
                    GameManager.instance.showGamePlay();
                })
                .start();
        } catch (error) {
            console.error('Exit animation error:', error);
            // Fallback: immediate transition
            this.node.destroy();
            GameManager.instance.showGamePlay();
        }
    }
}