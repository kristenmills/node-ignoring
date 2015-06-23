var program = require('commander');

program
  .version('0.0.1')
  .usage('[command] [options]');

program
  .command('create')
  .description('creates a new gitignore if one doesn\'t exist in the directory')
  .option('-g, --global', 'uses global gitignore')
  .action(function(options){

  });

program
  .command('add <items...>')
  .description('Adds a new item to the gitignore if it isn\'t already added')
  .option('-g, --global', 'uses global gitignore')
  .option('-t, --template', 'adds a template')
  .action(function(items, options){

  });

program
  .command('list')
  .description('lists the different templates')
  .option('-c, --custom', 'only list custom')
  .option('-g, --github', 'only list github')
  .action(function(options){

  });

program
  .command('show')
  .description('displays a gitignore')
  .option('-g, --global', 'displays global gitignore')
  .option('-t, --template <item>', 'displays a template')
  .action(function(options){

  });

module.exports = program;