export class GameConstants {
    // Screen dimensions
    static readonly CANVAS_WIDTH = 720;
    static readonly CANVAS_HEIGHT = 1280;

    // Game area
    static readonly GAME_AREA_TOP = 580;
    static readonly GAME_AREA_BOTTOM = -580;
    static readonly GAME_AREA_LEFT = -350;
    static readonly GAME_AREA_RIGHT = 350;

    // Paddle
    static readonly PADDLE_WIDTH = 120;
    static readonly PADDLE_HEIGHT = 20;
    static readonly PADDLE_Y_POSITION = -500;
    static readonly PADDLE_SPEED = 8;

    // Ball
    static readonly BALL_RADIUS = 12;
    static readonly BALL_SPEED = 10;
    static readonly BALL_START_Y = -480;

    // Bricks
    static readonly BRICK_WIDTH = 60;
    static readonly BRICK_HEIGHT = 30;
    static readonly BRICK_ROWS = 3;
    static readonly BRICK_COLS = 4;
    static readonly BRICK_SPACING_X = 8;
    static readonly BRICK_SPACING_Y = 8;
    static readonly BRICK_START_Y = 400;

    // Physics
    static readonly GRAVITY = -500;
    static readonly BOUNCE_DAMPING = 0.95;

    // UI
    static readonly UI_BUTTON_WIDTH = 200;
    static readonly UI_BUTTON_HEIGHT = 60;
    static readonly BONUS = 500;
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