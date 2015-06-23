var program = require('commander');
var ignoring = require('./ignoring');

program
  .version('0.0.1')
  .usage('[command] [options]');

program
  .command('create')
  .description('creates a new gitignore if one doesn\'t exist in the directory')
  .option('-g, --global <path>', 'uses global gitignore')
  .action(ignoring.create);

program
  .command('add [items...]')
  .description('Adds a new item to the gitignore if it isn\'t already added')
  .option('-g, --global', 'uses global gitignore')
  .option('-t, --templates', 'adds a template')
  .action(ignoring.add);

program
  .command('list')
  .description('lists the different templates')
  .option('-c, --custom', 'only list custom')
  .option('-g, --github', 'only list github')
  .action(ignoring.list);

program
  .command('show')
  .description('displays a gitignore')
  .option('-g, --global', 'displays global gitignore')
  .option('-t, --template <item>', 'displays a template')
  .action(ignoring.show);

module.exports = program;