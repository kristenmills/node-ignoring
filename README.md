# Ignoring

Tool for managing and creating your `.gitignore`.  A node port of my ruby gem [ignoring](https://github.com/kristenmills/ignoring).

## Installation

```
npm install ignoring
```

## Usage

This tool is realtively simple to use.  You can use either `ignoring` or `gitignore`. For these examples, I will be using `gitignore`.

### Creating a gitignore

Creating a .gitignore file in your currrent directory

    $ gitignore create

Creating a global gitignore (You will be prompted for a location)

    $ gitignore create -g
    $ gitignore create --global

### Adding to a gitignore

Adding items to the gitignore

    $ gitignore add tmp Gemfile.lock
    $ gitignore add -g .DS_Store
    $ gitignore add --global .DS_Store

Adding templates to the gitignore. (These are retrieved from github's gitignores and custom templates)

    $ gitignore add -t Node
    $ gitignore add -gt Node
    $ gitignore add --global --template Node

### List languages

List templats from github's gitignores and your own templates

    $ gitignore list

List just github templates

    $ gitignore list -g
    $ gitignore list --github

List just custom templates

    $ gitignore list -c
    $ gitignore list --custom

### Show gitignores

Print your local gitignore to STDOUT

    $ gitignore show

Print your global gitignore to STDOUT

    $ gitignore show -g
    $ gitignore show --global

Print a specific language to STDOUT

    $ gitignore show -t Node
    $ gitignore show --template Node

## Custom templates

To create custom templates, make a directory `$HOME/.ignoring` and create files `[TEMPLATE_NAME].gitignore`.  Anything that looks for templates will pull from here before looking on github so keep that in mind for name conflicts. In the future, I will allow for customizing that directory.

## Contributing

1. Fork it ( http://github.com/kristenmills/node-ignoring/fork )
2. Create your feature branch (`git checkout -b feature/my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-new-feature`)
5. Create new Pull Request
