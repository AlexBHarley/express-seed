'use strict';

/**
 * Dependencies
 */
let path = require('path');
let chalk = require('chalk');
let argv = require('yargs').argv;

/**
 * Determine environment and paths
 */
const ENV = argv.env || process.env.NODE_ENV || 'dev';
const BASE_PATH = path.resolve(path.join(__dirname, '..'));
const CONFIG_PATH = path.join(BASE_PATH, 'config');

/**
 * Load and merge environment configuration files
 */
let envCfg = loadConfig(ENV);
let localCfg = loadConfig('local');
let mergedCfg = Object.assign(envCfg, localCfg, {ENV});

/**
 * Export merged config
 */
module.exports = mergedCfg;

/**
 * Helper to load a config file
 */
function loadConfig(env) {
  let configPath = path.join(CONFIG_PATH, env);
  try {
    let config = require(configPath);
    if (env === 'local') {
      console.log(
        chalk.yellow('Using local configuration file'),
        chalk.magenta('local.js')
      );
    }
    return config;
  }
  catch (e) {
    if (env === 'development') {
      return loadConfig('dev');
    }
    if (env === 'production') {
      return loadConfig('prod');
    }
    if (env !== 'local') {
      console.log(
        chalk.red('Could not load environment configuration file'),
        chalk.magenta(env + '.js')
      );
      process.exit(0);
    }
    return {};
  }
}
