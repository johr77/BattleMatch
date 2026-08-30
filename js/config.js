/* Shared numbers. Game loop copies these onto locals too. */
window.BM = window.BM || {};
BM.COLS = 8;
BM.ROWS = 6;
BM.CELL = 0.92;
BM.BOARD_GAP = 1.35;
BM.COLORS = ["red", "blue", "green"];
BM.COLOR_HEX = { red: 0xe53935, blue: 0x1e88e5, green: 0x43a047 };
BM.MOVES_PER_TURN = 3;
BM.FIRE_TURNS = { red: 3, blue: 2, green: 1 };
BM.FIRE_DMG = { red: 28, blue: 16, green: 8 };
BM.UNIT_MAX_HP = 20;
BM.MAX_ON_BOARD = 24;
BM.START_RESERVE = 0;
BM.WAVE_TURNS = 5;
