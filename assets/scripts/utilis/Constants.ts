export class GameConstants {
    // Paddle
    static readonly PADDLE_WIDTH = 120;
    static readonly PADDLE_Y_POSITION = -500;
    static readonly PADDLE_SPEED = 8;

    // Ball
    static readonly BALL_SPEED = 10;
    static readonly BALL_START_Y = -480;

    // Bricks
    static readonly BRICK_WIDTH = 60;
    static readonly BRICK_HEIGHT = 30;
    static readonly BRICK_ROWS = 8;
    static readonly BRICK_COLS = 10;
    static readonly BRICK_SPACING_X = 8;
    static readonly BRICK_SPACING_Y = 8;

    static readonly BONUS = 500;
    static readonly LIVES = 3
}

export enum GameState {
    NONE,
    PLAYING,
    GAME_OVER,
    VICTORY
}

export enum BrickType {
    UNBREAKABLE = 0,
    NORMAL = 1,
    STRONG = 2,
}
export enum BrickHealth {
    UNBREAKABLE = 1000000000,
    NORMAL = 1,
    STRONG = 3,
}