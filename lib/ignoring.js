var NodeGit = require('nodegit');
var Promise = require('bluebird');
var fs = require('fs');
var rq = require('request-promise');

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
  Promise.coroutine(function *(){
    if(options.global){
      filepath = yield NodeGit
        .Config
        .openDefault()
        .then(function(config){
          return config.getString('core.excludesfile');
        })
        .then(function(res){
          return res;
        });
    } else {
      filepath = '.gitignore'
    }

    var lines = fs.readFileSync(filepath, { encoding: 'utf8' }).split('\n');
    var newLines = [];
    if(options.templates) {
      for(var i = 0; i < items.length; i++) {
        var newLines = newLines.concat(yield parseLanguage(items[i]))
      }
    } else {
      newLines = items;
    }

    for(var i = 0; i < newLines.length; i++) {
      var line = newLines[i];
      if(lines.indexOf(line) === -1 || line[0] === '#' || line.length === 0) {
        lines.push(line);
      }
    }
    fs.writeFileSync(filepath, lines.join('\n'));
  })();
}

function list(options) {

}

function show(options) {

}

function parseLanguage(language) {
  return rq
    .get({
      uri: 'https://api.github.com/gitignore/templates/' + language,
      headers: {
        'User-Agent': 'ignoring'
      }
    })
    .then(function(body){
      return JSON.parse(body).source.split('\n');
    })
    .catch(function(response){
      console.log(language, 'is not a valid language');
      return [];
    })
}

module.exports = {
	create: create,
  add: add,
  list: list,
  show: show
}