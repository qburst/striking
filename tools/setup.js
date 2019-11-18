/****************************************************************************************

    Striking is a simulation of a carrom board play where 2 players can 
    play carrom board (board version) using a browser. 

    Copyright © 2019  QBurst Technologies 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 3 of the License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/gpl-3.0.txt />.
 
****************************************************************************************/

'use strict';
let inquirer = require('inquirer');
let exec = require('child_process').exec

/**
 * Uses cocos console to create a cocos 2d js project
 * @param  {object} params project properties collected from stdin
 * @return {undefined}
 */
let createCocosProject = function(params) {
  let nativeOption = params.native ? '' : '--no-native';
  let create = `cocos new -d tools -l js -p ${params.package} '${params.project}'`;

  exec(create, function(error, stdout, stderr) {
    console.log(stdout);
    if (error) {
      console.log(error);
      return;
    }

    // move generated project to package root.
    console.log('-------- moving generated project to root --------');
    moveFiles(`${__dirname}/${params.project}`, __dirname + '/../');
  });
};

/**
 * Utility for moving files
 * @param  {string} from
 * @param  {string} to
 * @return {undefined}
 */
let moveFiles = function(from, to) {
  // using cp, I tried with mv though but this just works.
  let moveFiles = `cp -Trn '${from}' ${to} && rm -rf '${from}' | true`;
  exec(moveFiles, function(error, stdout, stderr) {
    console.log(stdout);
    if (error) {
      console.log(error);
      return;
    }

    // remove .git folder and other unnecessory files for new project
    // TODO
  });
};

let processInput = function(input) {
  // create cocos2d-x project with js as language
  console.log('-------- creating cocos 2d project --------');
  createCocosProject(input);
};

let questions = [
  {
    type: 'input',
    name: 'package',
    message: 'What\'s your package name',
    default: function () {
      return 'com.example.hello';
    },
    filter: function (val) {
      return val.toLowerCase();
    }
  },
  {
    type: 'input',
    name: 'project',
    message: 'What\'s your project name',
    default: function () {
      return 'Hello World';
    }
  }
];

console.log('-------- starting setup --------');
inquirer.prompt(questions).then(processInput);
