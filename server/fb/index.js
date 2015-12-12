'use strict';

const Promise = require('bluebird');
const chalk = require('chalk');
const Firebase = require('firebase');
const fb = new Firebase("https://resplendent-torch-2655.firebaseio.com/");

const startFbPromise = new Promise(function (resolve, reject) {
	if (!fb) reject (new Error ('Unable to connect to Firebase'));
    resolve(fb);
});

console.log(chalk.yellow('Opening connection to Firebase . . .'));
startFbPromise.then(function () {
    console.log(chalk.green('Firebase connection opened!'));
});

module.exports = startFbPromise;
