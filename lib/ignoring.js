var NodeGit = require('nodegit');
var Promise = require('bluebird');
var fs = require('fs');

function create(options) {
  Promise.coroutine(function *() {
    var filepath;
    if(options.global){
      filepath = yield NodeGit
        .Config
        .openDefault()
        .then(function(config){
          return config.setString('core.excludesfile', options.global);
        })
        .then(function(res){
          return options.global;
        });
     } else {
      filepath = '.gitignore'
     }
    fs.closeSync(fs.openSync(filepath, 'a'));
  })();
}

function add(items, options) {

}

function list(options) {

}

function show(options) {

}

module.exports = {
	create: create,
  add: add,
  list: list,
  show: show
}