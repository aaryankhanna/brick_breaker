import { _decorator, Component, Node, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { GameManager } from '../core/GameManager';
import { GamePlay } from '../core/GamePlay';

const { ccclass, property } = _decorator;

@ccclass('CollisionSystem')
export class CollisionSystem extends Component {
    private _gameManager: GamePlay = null!;

    public initialize(gameManager: GamePlay): void {
        this._gameManager = gameManager;
    }

}