import { _decorator, Component, instantiate, Node, Prefab, director } from 'cc';
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

    public stateLabel: Node = null;
    onLoad() {
        if (GameManager.instance) {
            this.destroy();
            return;
        }

        GameManager.instance = this;
    }

    start() {
        this.showGameStartUI();
    }

    public showGameStartUI() {
        const startNode = instantiate(this.gameStartPrefab);
        startNode.active = true
        this.gameStartNode.addChild(startNode);
    }

    public showGamePlay() {
        const top_HUD = instantiate(this.topHUD_prefab);
        this.uiNode.addChild(top_HUD);
        this.gameUIref = this.uiNode.getComponent(GameUI)
        this.topHUDref = top_HUD.getComponent(TopHUD)
        const gamePlay = instantiate(this.gamePlayAreaPrefab);
        this.gamePlayAreaNode.addChild(gamePlay);
    }

    public restartGame() {
        director.resume();
        this.destroyNodes();
        this.showGamePlay();
    }

    destroyNodes() {
        this.uiNode.destroyAllChildren();
        this.gamePlayAreaNode.destroyAllChildren();
        this.topHUDref = null;
        this.gameUIref = null;
    }
}