// @flow

const {randomIn, normalIn, oneOf} = require('../utils/stochastic');
const globalConfig = require('../config');
const {Entities} = require('../entities/registry');

const initWaveSystem = (store) => {
  const {dispatch} = store;
  let time = -1;
  return store.subscribe(() => {
    const state = store.getState();
    const {game} = state;
    if (!game) return;
    if (game.time == time) return;
    time = game.time;

    if (game.pauseMonsters) {
      return;
    }

    const gameSeconds = game.totalGameTime / 1000;

    let spawnRate = 350;

    if (game.time % spawnRate == 0) {
      let velocity = normalIn(20, 90);
      for (let x = 0; x < game.gridWidth; x++) {
        const position = {x, y: game.gridHeight - 1};
        velocity += (randomIn(0, 10) - 5);
        velocity = Math.max(velocity, 0);
        const wave = Entities.WAVE.make(game, position, velocity);
        dispatch({type: 'CREATE_ENTITY', entity: wave});
      }
    }

  });
};


module.exports = {initWaveSystem};
