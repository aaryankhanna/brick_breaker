import { _decorator, Component, director, Node } from 'cc';
import { GameManager } from '../core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('InfoPanel')
export class InfoPanel extends Component {
    onExit() {
        if (!GameManager.instance.stateLabel.active) {
            director.resume()
        }
        this.node.destroy()
    }
}


