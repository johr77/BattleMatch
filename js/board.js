/* Match, gravity, lock, and fire rules. */
window.BM = window.BM || {};
BM.isPlayerBoard = BM.isPlayerBoard || function () { return false; };
BM.addReserve = BM.addReserve || function () {};

BM.makeEmpty = function makeEmpty() {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
};

BM.makeUnitData = function makeUnitData(color) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      return {
        color, locked: false, isWall: false, isCamp: false, isTank: false, isPlane: false,
        fireTimer: 0, hp: UNIT_MAX_HP, maxHp: UNIT_MAX_HP, stars: 0, bonusDmg: 0, wallLevel: 1
      };
};

BM.boardUnitCount = function boardUnitCount(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      let n = 0;
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (board[r][c]) n++;
      return n;
};

BM.runLen = function runLen(board, r, c, color, dr, dc) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      let n = 0;
      let rr = r + dr, cc = c + dc;
      while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) {
        const cell = board[rr][cc];
        if (!cell || cell.locked || cell.isWall || cell.color !== color) break;
        n++;
        rr += dr;
        cc += dc;
      }
      return n;
};

BM.wouldCreateMatch = function wouldCreateMatch(board, r, c, color) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const vert = 1 + runLen(board, r, c, color, -1, 0) + runLen(board, r, c, color, 1, 0);
      const horz = 1 + runLen(board, r, c, color, 0, -1) + runLen(board, r, c, color, 0, 1);
      return vert >= 3 || horz >= 3;
};

BM.hasAnyFreeMatch = function hasAnyFreeMatch(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = board[r][c];
          if (!cell || cell.locked) continue;
          if (wouldCreateMatch(board, r, c, cell.color)) return true;
        }
      }
      return false;
};

BM.scrubFreeMatches = function scrubFreeMatches(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      for (let pass = 0; pass < 12 && hasAnyFreeMatch(board); pass++) {
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const cell = board[r][c];
            if (!cell || cell.locked) continue;
            if (!wouldCreateMatch(board, r, c, cell.color)) continue;
            let color, tries = 0;
            do {
              color = COLORS[Math.floor(Math.random() * COLORS.length)];
              tries++;
            } while (wouldCreateMatch(board, r, c, color) && tries < 40);
            cell.color = color;
            cell.isCamp = false;
            cell.isTank = false;
            cell.isPlane = false;
          }
        }
      }
};

BM.fillBoard = function fillBoard(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      // Pack up to MAX_ON_BOARD from the front — never create a 3-match
      let placed = 0;
      const max = MAX_ON_BOARD;
      for (let r = 0; r < ROWS && placed < max; r++) {
        for (let c = 0; c < COLS && placed < max; c++) {
          let color, tries = 0;
          do {
            color = COLORS[Math.floor(Math.random() * COLORS.length)];
            tries++;
          } while (wouldCreateMatch(board, r, c, color) && tries < 40);
          board[r][c] = makeUnitData(color);
          placed++;
        }
      }
      scrubFreeMatches(board);
};

BM.getBackRow = function getBackRow(board, col) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      for (let r = ROWS - 1; r >= 0; r--) if (board[r][col]) return r;
      return -1;
};

BM.columnCount = function columnCount(board, col) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      let n = 0;
      for (let r = 0; r < ROWS; r++) if (board[r][col]) n++;
      return n;
};

BM.makeWallCell = function makeWallCell() {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      return {
        color: "wall", locked: true, isWall: true, isCamp: false, isTank: false, isPlane: false,
        fireTimer: 0, hp: UNIT_MAX_HP, maxHp: UNIT_MAX_HP, stars: 0, bonusDmg: 0, wallLevel: 1
      };
};

BM.applyGravity = function applyGravity(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      for (let c = 0; c < COLS; c++) {
        const walls = [], locked = [], free = [];
        for (let r = 0; r < ROWS; r++) {
          const cell = board[r][c];
          if (!cell) continue;
          if (cell.isWall) walls.push(cell);
          else if (cell.locked) locked.push(cell);
          else free.push(cell);
        }
        for (let r = 0; r < ROWS; r++) board[r][c] = null;
        let i = 0;
        for (const g of walls) if (i < ROWS) board[i++][c] = g;
        for (const g of locked) if (i < ROWS) board[i++][c] = g;
        for (const g of free) if (i < ROWS) board[i++][c] = g;
      }
      mergeWalls(board);
};

BM.mergeWalls = function mergeWalls(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const isPlayer = BM.isPlayerBoard(board);
      for (let c = 0; c < COLS; c++) {
        const rows = [];
        for (let r = 0; r < ROWS; r++) {
          if (board[r][c] && board[r][c].isWall) rows.push(r);
        }
        if (rows.length < 2) continue;
        const front = board[rows[0]][c];
        if ((front.wallLevel || 1) >= 2) continue;
        const extra = board[rows[1]][c];
        front.wallLevel = 2;
        front.stars = 1;
        front.hp = (front.hp || UNIT_MAX_HP) + (extra.hp || UNIT_MAX_HP);
        front.maxHp = (front.maxHp || UNIT_MAX_HP) + (extra.maxHp || UNIT_MAX_HP);
        board[rows[1]][c] = null;
        BM.addReserve(isPlayer);
        if (BM.updateReserve) BM.updateReserve();
        // pack this column only (avoid re-entry loop)
        const kept = [];
        for (let r = 0; r < ROWS; r++) if (board[r][c]) kept.push(board[r][c]);
        for (let r = 0; r < ROWS; r++) board[r][c] = null;
        for (let i = 0; i < kept.length && i < ROWS; i++) board[i][c] = kept[i];
      }
};

BM.isMovable = function isMovable(board, r, c) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const cell = board[r][c];
      if (!cell || cell.locked) return false;
      return getBackRow(board, c) === r; // only the back unlocked unit
};

BM.findMatchFlags = function findMatchFlags(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const flags = new Map();
      function flag(key, color, wall, armed) {
        const cur = flags.get(key) || { wall: false, armed: false, color };
        if (wall) cur.wall = true;
        if (armed) cur.armed = true;
        cur.color = color;
        flags.set(key, cur);
      }
      for (let c = 0; c < COLS; c++) {
        let r = 0;
        while (r < ROWS) {
          const cell = board[r][c];
          if (!cell || cell.locked) { r++; continue; }
          let len = 1;
          while (r + len < ROWS) {
            const n = board[r + len][c];
            if (!n || n.locked || n.color !== cell.color) break;
            len++;
          }
          if (len >= 3) {
            const groups = Math.floor(len / 3);
            for (let g = 0; g < groups; g++) {
              for (let i = 0; i < 3; i++) {
                flag((r + g * 3 + i) + "," + c, cell.color, false, true);
              }
            }
          }
          r += len;
        }
      }
      for (let r = 0; r < ROWS; r++) {
        let c = 0;
        while (c < COLS) {
          const cell = board[r][c];
          if (!cell || cell.locked) { c++; continue; }
          let len = 1;
          while (c + len < COLS) {
            const n = board[r][c + len];
            if (!n || n.locked || n.color !== cell.color) break;
            len++;
          }
          if (len >= 3) {
            for (let i = 0; i < len; i++) flag(r + "," + (c + i), cell.color, true, false);
          }
          c += len;
        }
      }
      return flags;
};

BM.lockCellAsUnit = function lockCellAsUnit(cell) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      if (!cell || cell.isWall) return;
      cell.locked = true;
      cell.isWall = false;
      cell.isCamp = cell.color === "green";
      cell.isTank = cell.color === "blue";
      cell.isPlane = cell.color === "red";
      cell.fireTimer = FIRE_TURNS[cell.color];
};

BM.lockFreeVerticals = function lockFreeVerticals(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      let any = false;
      for (let c = 0; c < COLS; c++) {
        let r = 0;
        while (r < ROWS) {
          const cell = board[r][c];
          if (!cell || cell.locked) { r++; continue; }
          let len = 1;
          while (r + len < ROWS) {
            const n = board[r + len][c];
            if (!n || n.locked || n.color !== cell.color) break;
            len++;
          }
          if (len >= 3) {
            const groups = Math.floor(len / 3);
            for (let g = 0; g < groups; g++) {
              for (let i = 0; i < 3; i++) {
                lockCellAsUnit(board[r + g * 3 + i][c]);
                any = true;
              }
            }
          }
          r += len;
        }
      }
      return any;
};

BM.sealWallLineHoles = function sealWallLineHoles(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      let any = false;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 1; c < COLS - 1; c++) {
          const left = board[r][c - 1];
          const right = board[r][c + 1];
          const cell = board[r][c];
          if (!left || !left.isWall || !right || !right.isWall) continue;
          if (!cell || cell.isWall) continue;
          if (board[ROWS - 1][c]) continue;
          for (let rr = ROWS - 1; rr > r; rr--) board[rr][c] = board[rr - 1][c];
          const w = makeWallCell();
          w.wallLevel = left.wallLevel || 1;
          if (w.wallLevel >= 2) {
            w.stars = 1;
            w.hp = UNIT_MAX_HP * 2;
            w.maxHp = UNIT_MAX_HP * 2;
          }
          board[r][c] = w;
          any = true;
        }
      }
      return any;
};

BM.applyMatchFlags = function applyMatchFlags(board, flags, allowWalls) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      let anyWall = false, anyArmed = false;
      const bothCols = {};
      for (const [key, f] of flags) {
        const c = +key.split(",")[1];
        if (f.wall && f.armed) bothCols[c] = true;
      }

      // Units first so a vertical 3 is never eaten by the wall pass.
      for (const [key, f] of flags) {
        const [r, c] = key.split(",").map(Number);
        const cell = board[r][c];
        if (!cell || cell.locked) continue;
        if (f.armed) {
          lockCellAsUnit(cell);
          anyArmed = true;
        }
      }
      if (lockFreeVerticals(board)) anyArmed = true;

      if (allowWalls) {
        for (const [key, f] of flags) {
          const [r, c] = key.split(",").map(Number);
          const cell = board[r][c];
          if (!cell || cell.locked) continue;
          if (!f.wall) continue;
          cell.locked = true;
          cell.isWall = true;
          cell.isCamp = false;
          cell.isTank = false;
          cell.isPlane = false;
          cell.fireTimer = 0;
          cell.fromColor = cell.color;
          cell.color = "wall";
          cell.wallLevel = cell.wallLevel || 1;
          anyWall = true;
        }
      }

      applyGravity(board);

      if (allowWalls) {
        for (const cStr of Object.keys(bothCols)) {
          const c = +cStr;
          if (board[0][c] && board[0][c].isWall) continue;
          if (board[ROWS - 1][c]) continue;
          for (let r = ROWS - 1; r > 0; r--) board[r][c] = board[r - 1][c];
          board[0][c] = makeWallCell();
          anyWall = true;
        }
        if (lockFreeHorizontals(board)) {
          anyWall = true;
          applyGravity(board);
        }
        if (anyWall) sealWallLineHoles(board);
      }

      if (lockFreeVerticals(board)) anyArmed = true;
      applyGravity(board);
      return { anyWall, anyArmed };
};

BM.lockFreeHorizontals = function lockFreeHorizontals(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      let any = false;
      for (let r = 0; r < ROWS; r++) {
        let c = 0;
        while (c < COLS) {
          const cell = board[r][c];
          if (!cell || cell.locked) { c++; continue; }
          let len = 1;
          while (c + len < COLS) {
            const n = board[r][c + len];
            if (!n || n.locked || n.color !== cell.color) break;
            len++;
          }
          if (len >= 3) {
            for (let i = 0; i < len; i++) {
              const x = board[r][c + i];
              x.locked = true;
              x.isWall = true;
              x.isCamp = false;
              x.isTank = false;
              x.isPlane = false;
              x.fireTimer = 0;
              x.fromColor = x.color;
              x.color = "wall";
              x.wallLevel = x.wallLevel || 1;
              any = true;
            }
          }
          c += len;
        }
      }
      return any;
};

BM.checkAndLockMatches = function checkAndLockMatches(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const before = countLocks(board);
      let anyWall = false, anyArmed = false, any = false;
      // Every pass: units first, then walls. Later passes still make walls
      // so a 3-in-a-row that only lines up after gravity locks this turn.
      for (let pass = 0; pass < 8; pass++) {
        const flags = findMatchFlags(board);
        if (flags.size === 0) break;
        any = true;
        const res = applyMatchFlags(board, flags, true);
        if (res.anyWall) anyWall = true;
        if (res.anyArmed) anyArmed = true;
        mergeStackedFormations(board);
      }
      if (anyWall) if (BM.playHammerSound) BM.playHammerSound();
      if (anyArmed) if (BM.playGunCockSound) BM.playGunCockSound();
      BM.lastLockDesc = describeLockDelta(before, countLocks(board));
      return any;
};

BM.mergeStackedFormations = function mergeStackedFormations(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const isPlayer = BM.isPlayerBoard(board);
      const kinds = ["isTank", "isCamp", "isPlane"];
      for (let c = 0; c < COLS; c++) {
        for (const kind of kinds) {
          const rows = [];
          for (let r = 0; r < ROWS; r++) {
            const cell = board[r][c];
            if (cell && cell.locked && cell[kind]) rows.push(r);
          }
          while (rows.length >= 6) {
            const keep = rows.slice(0, 3);
            const drop = rows.slice(3, 6);
            const head = board[keep[0]][c];
            const color = head.color;
            head.stars = (head.stars || 0) + 1;
            head.bonusDmg = (head.bonusDmg || 0) + FIRE_DMG[color] * 3;
            head.hp += UNIT_MAX_HP;
            head.maxHp += UNIT_MAX_HP;
            for (const r of keep) {
              if (board[r][c]) {
                board[r][c].stars = head.stars;
                board[r][c].bonusDmg = head.bonusDmg;
                board[r][c].hp = head.hp;
                board[r][c].maxHp = head.maxHp;
                board[r][c].fireTimer = head.fireTimer; // keep top tank timer
              }
            }
            for (const r of drop) {
              board[r][c] = null;
              BM.addReserve(isPlayer);
            }
            if (BM.updateReserve) BM.updateReserve();
            applyGravity(board);
            rows.length = 0;
            for (let r = 0; r < ROWS; r++) {
              const cell = board[r][c];
              if (cell && cell.locked && cell[kind]) rows.push(r);
            }
          }
        }
      }
};

BM.processFiring = function processFiring(board, isPlayerBoard) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const firers = [];
      const toRemove = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = board[r][c];
          if (cell && cell.locked && !cell.isWall && cell.fireTimer > 0) {
            cell.fireTimer--;
            if (cell.fireTimer <= 0) {
              firers.push({
                col: c, color: cell.color,
                dmg: FIRE_DMG[cell.color],
                bonus: cell.bonusDmg || 0,
                stars: cell.stars || 0,
                r,
                isCamp: !!cell.isCamp, isTank: !!cell.isTank, isPlane: !!cell.isPlane
              });
              toRemove.push({ r, c });
            }
          }
        }
      }
      for (const { r, c } of toRemove) {
        board[r][c] = null;
        BM.addReserve(isPlayerBoard);
      }
      if (toRemove.length) applyGravity(board);
      if (BM.updateReserve) BM.updateReserve();
      if (BM.dispatchFire) BM.dispatchFire(firers, isPlayerBoard);
      return firers.length;
};

BM.countLocks = function countLocks(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const n = { walls: 0, camps: 0, tanks: 0, planes: 0, armed: 0 };
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = board[r][c];
          if (!cell || !cell.locked) continue;
          if (cell.isWall) n.walls++;
          else if (cell.isCamp) n.camps++;
          else if (cell.isTank) n.tanks++;
          else if (cell.isPlane) n.planes++;
          else n.armed++;
        }
      }
      return n;
};

BM.describeLockDelta = function describeLockDelta(before, after) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      const parts = [];
      const dw = after.walls - before.walls;
      const dc = after.camps - before.camps;
      const dt = after.tanks - before.tanks;
      const dp = after.planes - before.planes;
      if (dc > 0) parts.push("camp +" + dc);
      if (dt > 0) parts.push("tank outpost +" + dt);
      if (dp > 0) parts.push("plane +" + dp);
      if (dw > 0) parts.push("wall +" + dw);
      if (dc < 0) parts.push("camp " + dc);
      if (dt < 0) parts.push("tank " + dt);
      if (dp < 0) parts.push("plane " + dp);
      if (dw < 0) parts.push("wall " + dw);
      return parts.length ? parts.join(" · ") : "lock";
};

BM.describeLocks = function describeLocks(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      return describeLockDelta({ walls: 0, camps: 0, tanks: 0, planes: 0, armed: 0 }, countLocks(board));
};

BM.cloneCell = function cloneCell(cell) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      return cell ? Object.assign({}, cell) : null;
};

BM.cloneBoard = function cloneBoard(board) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      return board.map(row => row.map(cloneCell));
};

BM.columnHasUnit = function columnHasUnit(board, col) {
  const COLS = BM.COLS, ROWS = BM.ROWS;
  const COLORS = BM.COLORS;
  const FIRE_TURNS = BM.FIRE_TURNS;
  const FIRE_DMG = BM.FIRE_DMG;
  const UNIT_MAX_HP = BM.UNIT_MAX_HP;
  const MAX_ON_BOARD = BM.MAX_ON_BOARD;
  const makeEmpty = BM.makeEmpty;
  const makeUnitData = BM.makeUnitData;
  const runLen = BM.runLen;
  const wouldCreateMatch = BM.wouldCreateMatch;
  const hasAnyFreeMatch = BM.hasAnyFreeMatch;
  const makeWallCell = BM.makeWallCell;
  const applyGravity = BM.applyGravity;
  const mergeWalls = BM.mergeWalls;
  const lockCellAsUnit = BM.lockCellAsUnit;
  const lockFreeVerticals = BM.lockFreeVerticals;
  const lockFreeHorizontals = BM.lockFreeHorizontals;
  const sealWallLineHoles = BM.sealWallLineHoles;
  const findMatchFlags = BM.findMatchFlags;
  const applyMatchFlags = BM.applyMatchFlags;
  const mergeStackedFormations = BM.mergeStackedFormations;
  const countLocks = BM.countLocks;
  const describeLockDelta = BM.describeLockDelta;
  const getBackRow = BM.getBackRow;
  const cloneCell = BM.cloneCell;

      for (let r = 0; r < ROWS; r++) if (board[r][col]) return true;
      return false;
};
