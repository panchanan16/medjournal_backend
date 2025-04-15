const { globSync } = require('glob');
const path = require('path');

function coreEntityControllers() {
  const controllerItems = globSync(`./controllers/entity/*`, {
    ignore: ['index.js'],
  });
  const controllers = {};
  controllerItems.forEach((ctrlItem) => {
    const ctrlName = path.basename(ctrlItem);
    if (ctrlName !== 'index.js') {
      const controller = require(`@/controllers/entity/${ctrlName}`);
      controllers[ctrlName] = controller;
    }
  });

  return controllers;
}

module.exports = coreEntityControllers();