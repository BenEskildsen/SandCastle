// @flow

const {add} = require('../utils/vectors');
const {randomIn, normalIn} = require('../utils/stochastic');
const {makeEntity} = require('./makeEntity');
const {
  getInterpolatedIndex, getMissileSprite,
} = require('../selectors/sprites');
const {getDuration} = require('../simulation/actionQueue');
const globalConfig = require('../config');

/**
 *  Explosives explode when they die. They can be killed by
 *  running out of hp or by having an age (in ms) greater than their timer
 *  time (set timer to null if you don't want it to do this).
 */

const config = {
  BALLISTIC: true,
  damage: 10,
  hp: 10,
  width: 1,
  height: 1,
  velocity: 50,
  blockingTypes: [
    'DIRT', 'STONE', 'FOOD', 'AGENT',
    'DOODAD', 'WORM',
    'FAST_TURRET', 'TURBINE',
    'IRON', 'STEEL', 'COAL',
    'BASIC_TURRET', 'LASER_TURRET',
    'BASE', 'MISSILE_TURRET', 'ICE',
    'URANIUM',
  ],

  DIE: {
    duration: 1,
    spriteOrder: [0],
  },
};

const make = (
  game: Game,
  position: Vector,
  velocity: ?number,
): Missile => {
  const theta = 3 * Math.PI / 2;
  return {
    ...makeEntity('WAVE', position, config.width, config.height),
    ...config,
    playerID: 0,

    // required for ballistics
    age: 0,
    actions: [],
    velocity: velocity != null ? velocity : normalIn(20, 90),
    initialPosition: {...position},
    ballisticPosition: {...position},
    theta,
    ballisticTheta: theta,
    initialTheta: theta,

    PIERCING: false,

    prevPositions: [position],
  };
};

const render = (ctx, game, wave): void => {
  ctx.save();
  const {
    width, height, theta,
    ballisticTheta,
    ballisticPosition, prevPositions,
  } = wave;
  const position = ballisticPosition;

  ctx.fillStyle = "steelblue";
  ctx.globalAlpha = 0.2;
  ctx.fillRect(position.x, position.y, width, height);

  // trace out the trajectory
  for (const prev of prevPositions) {
    // const alpha = (prev.y / game.gridHeight) * 0.75;
    if (prev.y < position.y) continue; // don't render above the wave
    const alpha = 0.3;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(70, 130, 180, ' + alpha + ')';
    ctx.fillRect(prev.x, prev.y, width, height);
  }

  ctx.restore();
};

module.exports = {config, make, render};
