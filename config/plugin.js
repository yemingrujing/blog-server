'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  'validate': {
    'enable': true,
    'package': 'egg-validate',
  },
  'nunjucks': {
    'enable': true,
    'package': 'egg-view-nunjucks',
  },
  'jwt ': {
    'enable': true,
    'package': 'egg-jwt',
  },
  'cors ': {
    'enable': true,
    'package': 'egg-cors',
  },
  'sequelize': {
    'enable': true,
    'package': 'egg-sequelize',
  },
};
