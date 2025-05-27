import { _decorator, Component, Node, instantiate, Prefab, Vec3, director, UITransform } from 'cc';
import { Ball } from '../components/Ball';
import { Brick } from '../components/Brick';
import { Paddle } from '../components/Paddle';
import { CollisionSystem } from '../system/CollisionSystem';
import { InputSystem } from '../system/InputSystem';
import { GameUI } from '../ui/GameUI';
import { GameState, GameConstants, BrickType } from '../utilis/Constants';


const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Prefab)
    ballPrefab: Prefab = null!;

    @property(Prefab)
    paddlePrefab: Prefab = null!;

    @property(Prefab)
    brickPrefab: Prefab = null!;

    @property(Node)
    gamePlayArea: Node = null!;

    @property(GameUI)
    gameUI: GameUI = null!;

    private static _instance: GameManager;
    private _currentState: GameState = GameState.NONE;
    private _ball: Node = null!;
    private _paddle: Node = null!;
    private _bricks: Node[] = [];
    private _inputSystem: InputSystem = null!;
    private _collisionSystem: CollisionSystem = null!;
    private _score: number = 0;
    private _lives: number = 3;
    private _areaLeft = 0;
    private _areaRight = 0;
    private _areaTop = 0;
    private _areaBottom = 0;


    public static get instance(): GameManager {
        return GameManager._instance;
    }

    protected onLoad(): void {
        GameManager._instance = this;
        this.updateGameAreaBounds();
        this.initializeSystems();
    }
    private updateGameAreaBounds(): void {
        const uiTransform = this.gamePlayArea.getComponent(UITransform);
        if (!uiTransform) {
            console.warn("GamePlayArea missing UITransform component.");
            return;
        }

        const width = uiTransform.width;
        const height = uiTransform.height;

        // Assumes anchor point is center (0.5, 0.5)
        this._areaLeft = -width / 2;
        this._areaRight = width / 2;
        this._areaTop = height / 2;
        this._areaBottom = -height / 2;
    }


    protected start(): void {
        this.initializeGame();
    }

    private initializeSystems(): void {
        this._inputSystem = this.getComponent(InputSystem) || this.addComponent(InputSystem);
        this._collisionSystem = this.getComponent(CollisionSystem) || this.addComponent(CollisionSystem);

        this._inputSystem.initialize(this);
        if (this._collisionSystem && typeof this._collisionSystem.initialize === 'function') {
            this._collisionSystem.initialize(this);
        }
    }

    private initializeGame(): void {
        this.createPaddle();
        this.createBricks();
        this.setState(GameState.PLAYING);
        this.spawnBall();
    }

    private createPaddle(): void {
        this._paddle = instantiate(this.paddlePrefab);
        this._paddle.setPosition(0, GameConstants.PADDLE_Y_POSITION, 0);
        this.gamePlayArea.addChild(this._paddle);
    }

    private createBricks(): void {
        // Convert top edge of GamePlayArea (local Y = height/2) to world space
        const topLocal = new Vec3(0, this.gamePlayArea.getComponent(UITransform)!.height / 2, 0);
        const topWorld = this.gamePlayArea.getComponent(UITransform)!.convertToWorldSpaceAR(topLocal);

        // Convert world position back to local position of GamePlayArea
        const localTop = new Vec3();
        this.gamePlayArea.inverseTransformPoint(localTop, topWorld);

        const totalWidth = (GameConstants.BRICK_COLS - 1) * (GameConstants.BRICK_WIDTH + GameConstants.BRICK_SPACING_X);
        const startX = -totalWidth / 2;
        const startY = localTop.y - GameConstants.BRICK_HEIGHT / 2;

        // Calculate total bricks and determine random distribution
        const totalBricks = GameConstants.BRICK_ROWS * GameConstants.BRICK_COLS;
        const maxUnbreakable = Math.floor(totalBricks * 0.15); // Max 15% unbreakable
        const maxStrong = Math.floor(totalBricks * 0.35); // Max 35% strong
        // Rest will be normal bricks

        // Create array of brick types for random distribution
        const brickTypes: BrickType[] = [];

        // Add unbreakable bricks (limited amount)
        for (let i = 0; i < maxUnbreakable; i++) {
            brickTypes.push(BrickType.UNBREAKABLE);
        }

        // Add strong bricks
        for (let i = 0; i < maxStrong; i++) {
            brickTypes.push(BrickType.STRONG);
        }

        // Fill the rest with normal bricks
        while (brickTypes.length < totalBricks) {
            brickTypes.push(BrickType.NORMAL);
        }

        // Shuffle the array for random distribution
        this.shuffleArray(brickTypes);

        let brickIndex = 0;
        let breakableBrickCount = 0; // Track breakable bricks for win condition

        for (let row = 0; row < GameConstants.BRICK_ROWS; row++) {
            for (let col = 0; col < GameConstants.BRICK_COLS; col++) {
                const brick = instantiate(this.brickPrefab);
                const x = startX + col * (GameConstants.BRICK_WIDTH + GameConstants.BRICK_SPACING_X);
                const y = startY - row * (GameConstants.BRICK_HEIGHT + GameConstants.BRICK_SPACING_Y);

                brick.setPosition(x, y, 0);

                const brickComponent = brick.getComponent(Brick)!;
                const brickType = brickTypes[brickIndex++];

                brickComponent.setBrickType(brickType);

                // Only add breakable bricks to the tracking array
                if (brickType !== BrickType.UNBREAKABLE) {
                    this._bricks.push(brick);
                    breakableBrickCount++;
                }

                this.gamePlayArea.addChild(brick);
            }
        }

        // Ensure we have at least some breakable bricks for the game to be winnable
        if (breakableBrickCount === 0) {
            console.warn("No breakable bricks created! Converting some unbreakable bricks to normal.");
            // this.ensureBreakableBricks();
        }
    }

    // Fisher-Yates shuffle algorithm
    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Fallback method to ensure game is always winnable
    // private ensureBreakableBricks(): void {
    //     const allBricks = this.gamePlayArea.children.filter(child =>
    //         child.getComponent(Brick) !== null
    //     );

    //     let convertedCount = 0;
    //     const minBreakableBricks = Math.max(5, Math.floor(allBricks.length * 0.3)); // At least 30% breakable

    //     for (const brickNode of allBricks) {
    //         const brickComponent = brickNode.getComponent(Brick)!;

    //         // Convert unbreakable to normal if we need more breakable bricks
    //         if (convertedCount < minBreakableBricks &&
    //             brickComponent.getBrickType &&
    //             brickComponent.getBrickType() === BrickType.UNBREAKABLE) {

    //             brickComponent.setBrickType(BrickType.NORMAL);
    //             this._bricks.push(brickNode);
    //             convertedCount++;
    //         }

    //         if (convertedCount >= minBreakableBricks) {
    //             break;
    //         }
    //     }
    // }




    private spawnBall(): void {
        if (this._ball) {
            this._ball.destroy();
        }

        this._ball = instantiate(this.ballPrefab);
        this._ball.setPosition(0, GameConstants.BALL_START_Y, 0);
        this.gamePlayArea.addChild(this._ball);

        const ballComponent = this._ball.getComponent(Ball)!;
        ballComponent.attachToPaddle(this._paddle);
    }

    public launchBall(): void {
        if (this._ball) {
            const ballComponent = this._ball.getComponent(Ball)!;
            ballComponent.launch();
        }
    }

    public onBrickDestroyed(brick: Node): void {
        const index = this._bricks.indexOf(brick);
        if (index > -1) {
            this._bricks.splice(index, 1);
            this._score += 100;
            this.gameUI.updateScore(this._score);

            if (this._bricks.length === 0) {
                this.setState(GameState.VICTORY);
            }
        }
    }

    public onBallLost(): void {
        this._lives--;
        this.gameUI.updateLives(this._lives);

        if (this._lives <= 0) {
            this.setState(GameState.GAME_OVER);
        } else {
            this.spawnBall();
        }
    }

    public movePaddle(direction: number): void {
        if (this._paddle && this._currentState === GameState.PLAYING) {
            const paddleComponent = this._paddle.getComponent(Paddle)!;
            paddleComponent.move(direction);
        }
    }

    public restartGame(): void {
        director.resume()
        this.clearGame();
        this._score = 0;
        this._lives = 3;
        this.gameUI.updateScore(this._score);
        this.gameUI.updateLives(this._lives);
        this.initializeGame();
    }

    private clearGame(): void {
        if (this._ball) {
            this._ball.destroy();
            this._ball = null!;
        }

        if (this._paddle) {
            this._paddle.destroy();
            this._paddle = null!;
        }

        this._bricks.forEach(brick => brick.destroy());
        this._bricks = [];
    }

    private setState(newState: GameState): void {
        this._currentState = newState;
        this.gameUI.onStateChanged(newState);
    }

    public get currentState(): GameState {
        return this._currentState;
    }

    public get ball(): Node {
        return this._ball;
    }

    public get paddle(): Node {
        return this._paddle;
    }

    public get bricks(): Node[] {
        return this._bricks;
    }
    public get gameAreaLeft(): number {
        return this._areaLeft;
    }

    public get gameAreaRight(): number {
        return this._areaRight;
    }

    public get gameAreaTop(): number {
        return this._areaTop;
    }

    public get gameAreaBottom(): number {
        return this._areaBottom;
    }
    public get livesLeft(): number {
        return this._lives;
    }

}