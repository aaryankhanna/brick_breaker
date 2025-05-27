import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { GameUI } from '../ui/GameUI';
import { TopHUD } from '../ui/TopHUD';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    public static instance: GameManager;

    @property(Prefab)
    gameStartPrefab: Prefab = null;
    @property(Prefab)
    topHUD_prefab: Prefab = null;
    @property(Prefab)
    gamePlayAreaPrefab: Prefab = null;
    @property(Node)
    gameStartNode: Node = null;
    @property(Node)
    uiNode: Node = null;
    @property(Node)
    gamePlayAreaNode: Node = null;

    public topHUDref: TopHUD = null;
    public gameUIref: GameUI = null;

    onLoad() {
        if (GameManager.instance) {
            console.warn('GameManager instance already exists!');
            this.destroy();  // Prevent duplicates
            return;
        }

        GameManager.instance = this;
    }

    start() {
        this.showGameStartUI();
    }

    update(deltaTime: number) {
        // Any per-frame logic
    }

    // You can also add reusable methods here
    public showGameStartUI() {
        const startNode = instantiate(this.gameStartPrefab);
        this.gameStartNode.addChild(startNode);
    }
    public showGamePlay() {
        const top_HUD = instantiate(this.topHUD_prefab);
        this.uiNode.addChild(top_HUD);
        this.gameUIref = this.uiNode.getComponent(GameUI)
        this.topHUDref = top_HUD.getComponent(TopHUD)
        const gamePlay = instantiate(this.gamePlayAreaPrefab);
        this.gamePlayAreaNode.addChild(gamePlay);
        console.log("in game play");

    }
    destroyNodes() {
        this.gameStartNode.destroyAllChildren();
        this.uiNode.destroyAllChildren();
        this.gamePlayAreaNode.destroyAllChildren();
    }
}
