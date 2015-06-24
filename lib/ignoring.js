var NodeGit = require('nodegit');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var path = require('path');
var rq = Promise.promisifyAll(require('request'));
var Table = require('cli-table');


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

    var lines = yield fs
      .readFileAsync(filepath, { encoding: 'utf8' })
      .then(function(contents){
        return contents.split('\n');
      })
      .catch(function(){
        return [];
      });
    var newLines = [];
    if(options.templates) {
      for(var i = 0; i < items.length; i++) {
        var newLines = newLines.concat(yield parseTemplate(items[i]))
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
  Promise.coroutine(function *(){
    if(options.github || (!options.github && !options.custom)) {
      var templates = tableize(yield githubTemplates());
      console.log('Github:');
      console.log(templates);
    }

    if((options.github && options.custom) || (!options.github && !options.custom)) {
      console.log();
    }

    if(options.custom || (!options.github && !options.custom))  {
      var templates = tableize(yield customTemplates());
      console.log('Custom:');
      console.log(templates);
    }
  })();
}

function show(options) {

}

// Helpers

function githubTemplates() {
  return rq
    .getAsync({
      url: 'https://api.github.com/gitignore/templates',
      headers:
{        'User-Agent': 'ignoring'
      }
    })
    .spread(function(response, body){
      return JSON.parse(body);
    })
    .catch(function(body){
      console.log('Error getting language information. Might have been rate limited');
      return [];
    });
}

function customTemplates() {
  return fs
    .readdirAsync(path.join(process.env.HOME, '.ignoring'))
    .map(function(val){
      return val.split('.')[0];
    })
    .catch(function(){
      return [];
    })
}

function tableize(array) {
  var table = new Table({
  chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
         , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
         , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
         , 'right': '' , 'right-mid': '' , 'middle': ' ' },
  style: { 'padding-left': 0, 'padding-right': 0 }
});

  for(var i = 0, j = -1; i < array.length; i++) {
    if(i % 4 === 0 ) {
      j++;
      table.push([]);
    }

    table[j].push(array[i]);
  }

  return table.toString();
}

function parseTemplate(template) {
  return fs
    .readFileAsync(path.join(process.env.HOME, '.ignoring', template + '.gitignore'), { encoding: 'utf8' })
    .then(function(contents){
      return contents.split('\n');
    })
    .catch(function(){
      return parseLanguage(template);
    });
}

function parseLanguage(template) {
  return rq
    .getAsync({
      url: 'https://api.github.com/gitignore/templates/' + template,
      headers: {
        'User-Agent': 'ignoring'
      }
    })
    .spread(function(response, body){
      return JSON.parse(body).source.split('\n');
    })
    .catch(function(body){
      console.log(template, 'is not a valid template');
      return [];
    })
}

module.exports = {
	create: create,
  add: add,
  list: list,
  show: show
}