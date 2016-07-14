# Gulp boilerplate

This repository contains a base starter kit for a Gulp-4-based front-end web development workflow, including following CLI commands, available through npm or Gulp CLI when installed globally.

* npm start / gulp
* npm run build / gulp build
* npm run serve / gulp serve


## Build process

### scripts

* Lint (using ESLint)
* Bundle & minify with sourcemaps (using Browserify & Uglify)
* Transpile ES2016 with Babel (using Babelify)
* Watch & rebuild incremental (using Watchify)


### Styles

* Compile Sass (SCSS) to CSS
* Add vendor prefixes with Autoprefixer
* Concatenate & minify with sourcemaps
* Watch for file changes & rebuild


## Development server

* Browsersync provides a development server that reloads the browser when the build is updated


## TODO:

* Finetune the watching / tasks & incremental build, optimized for performance
* Update readme
* Add image processing, unit testing & coverage ...
* Consider useref, omit revving, hot module reloading, split bundles & styles ...
