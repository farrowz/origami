// Credit goes to https://github.com/filipesilva/angular-quickstart-lib for this build file
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const ngc = require('@angular/compiler-cli/src/main').main;
const camelcase = require('camelcase');
const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify');
const sourcemaps = require('rollup-plugin-sourcemaps');

build({
  scope: '@codebakery',
  name: 'origami',
  bundleName: 'origami',
  src: path.join(__dirname, 'src'),
  es6Folder: path.join(__dirname, 'out-tsc/es6'),
  es5Folder: path.join(__dirname, 'out-tsc/es5'),
  distFolder: path.join(__dirname, 'dist'),
  distSrcFolder: path.join(__dirname, 'dist'),
  packageFolder: __dirname
}).then(() => {
  /*return build({
    scope: '@codebakery/origami',
    name: 'collections',
    bundleName: 'origami-collections',
    src: path.join(__dirname, 'src/collections'),
    es6Folder: path.join(__dirname, 'out-tsc/es6-collections'),
    es5Folder: path.join(__dirname, 'out-tsc/es5-collections'),
    distFolder: path.join(__dirname, 'dist'),
    distSrcFolder: path.join(__dirname, 'dist/collections'),
    packageFolder: path.join(__dirname, 'src/collections')
  });*/
}).catch(e => {
  console.error('Build failed.\n');
  if (e) {
    console.error(e);
  }

  process.exit(1);
});

function build(opts) {
  return Promise.resolve().then(() => {
    // Compile to ES6
    return ngc({ project: path.join(opts.src, 'tsconfig.json') })
        .then(exitCode => exitCode === 0 ? Promise.resolve() : Promise.reject())
        .then(() => console.log(`${opts.name} ES6 compilation succeeded.`));
    }).then(() => {
      // Compile to ES5
      return ngc({ project: path.join(opts.src, 'tsconfig.es5.json') })
        .then(exitCode => exitCode === 0 ? Promise.resolve() : Promise.reject())
        .then(() => console.log(`${opts.name} ES5 compilation succeeded.`));
    }).then(() => {
      // Copy typings and metadata to `dist/` folder
      return Promise.all([
        _relativeCopy('**/*.d.ts', opts.es6Folder, opts.distSrcFolder),
        _relativeCopy('**/*.metadata.json', opts.es6Folder, opts.distSrcFolder)
      ]).then(() => console.log(`${opts.name} Typings and metadata copy succeeded.`));
    }).then(() => {
      // Bundle library
      const es5Entry = path.join(opts.es5Folder, `${opts.name}.js`);
      const es6Entry = path.join(opts.es6Folder, `${opts.name}.js`);
      const globals = {
        '@angular/core': 'ng.core',
        '@angular/forms': 'ng.forms',
        '@angular/platform-browser': 'ng.platformBrowser',
        'rxjs': 'Rx'
      };

      const rollupBaseConfig = {
        moduleName: camelcase(opts.name),
        sourceMap: true,
        globals: globals,
        external: Object.keys(globals),
        plugins: [sourcemaps()]
      };

      // UMD bundle
      const umdConfig = Object.assign({}, rollupBaseConfig, {
        entry: es5Entry,
        dest: path.join(opts.distFolder, 'bundles', `${opts.bundleName}.umd.js`),
        format: 'umd'
      });

      // Minified UMD bundle
      const minifiedUmdConfig = Object.assign({}, rollupBaseConfig, {
        entry: es5Entry,
        dest: path.join(opts.distFolder, 'bundles', `${opts.bundleName}.umd.min.js`),
        format: 'umd',
        plugins: rollupBaseConfig.plugins.concat([uglify({})])
      });

      // ESM+ES5 flat module bundle
      const fesm5Config = Object.assign({}, rollupBaseConfig, {
        entry: es5Entry,
        dest: path.join(opts.distFolder, opts.scope, `${opts.name}.es5.js`),
        format: 'es'
      });

      // ESM+ES2015 flat module bundle
      const fesm2015Config = Object.assign({}, rollupBaseConfig, {
        entry: es6Entry,
        dest: path.join(opts.distFolder, opts.scope, `${opts.name}.js`),
        format: 'es'
      });

      const allBundles = [
        umdConfig,
        minifiedUmdConfig,
        fesm5Config,
        fesm2015Config
      ].map(cfg => rollup.rollup(cfg).then(bundle => bundle.write(cfg)));

      return Promise.all(allBundles).then(() => console.log(`${opts.name} bundles succeeded.`));
    }).then(() => {
      // Copy package files
      return Promise.all([
        _relativeCopy('LICENSE.txt', opts.packageFolder, opts.distSrcFolder),
        _relativeCopy('package.json', opts.packageFolder, opts.distSrcFolder),
        _relativeCopy('README.md', opts.packageFolder, opts.distSrcFolder)
      ]).then(() => console.log(`${opts.name} package files copy succeeded.`));
    });
}

// Copy files maintaining relative paths.
function _relativeCopy(fileGlob, from, to) {
  return new Promise((resolve, reject) => {
    glob(fileGlob, { cwd: from, nodir: true }, (err, files) => {
      if (err) reject(err);
      files.forEach(file => {
        const origin = path.join(from, file);
        const dest = path.join(to, file);
        const data = fs.readFileSync(origin, 'utf-8');
        _recursiveMkDir(path.dirname(dest));
        fs.writeFileSync(dest, data);
      });

      resolve();
    })
  });
}

// Recursively create a dir.
function _recursiveMkDir(dir) {
  if (!fs.existsSync(dir)) {
    _recursiveMkDir(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}
