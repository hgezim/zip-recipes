var gulp = require("gulp");
var del = require("del");
var rename = require("gulp-rename");
var filter = require("gulp-filter");
var replace = require("gulp-replace");
var zip = require("gulp-zip");
var shell = require('gulp-shell');
var sequence = require('run-sequence');
var path = require("path");
var fs = require("fs");
var debug = require("gulp-debug");
//custom templates requirements
var sass = require('gulp-sass');
const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');

var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var prefix = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var merge = require('merge-stream');
var log = require('fancy-log');
var watch = require('gulp-watch');

const build_path = "build";
const dest_free = path.join(build_path, "free");
const dest_premium_lover = path.join(build_path, "premium-lover");
const dest_premium_admirer = path.join(build_path, "premium-admirer");
const dest_premium_friend = path.join(build_path, "premium-friend");
const translationTemplateFilePath = "./src/languages/zip-recipes.pot";
// Custom Templates paths
const ext_location = 'src/plugins/';
const assets_parent = '/views/';
const modules = 'node_modules/';

/**
 *  Task to build premium (lover plan) version of Zip Recipes.
 */
gulp.task("build-premium-lover", function () {
  // used to rename premium readme file
  var premiumFileFilter = filter('PREMIUM_README.md', {restore: true});

  // used to change plugin name to Zip Recipes premium
  var mainPluginFileFilter = filter('zip-recipes.php', {restore: true});

  return gulp.src([
    "src/**",
    "!src/README.md",
    "!src/composer.*",
    "!node_modules/**",
    "!src/vendor-dev/**",
    "!src/vendor-dev",
    "LICENSE",
    "!src/plugins/**"
  ])
    // rename premium read me
    .pipe(premiumFileFilter)
    .pipe(rename("README.md"))
    .pipe(premiumFileFilter.restore)

    // replace plugin name to premium
    .pipe(mainPluginFileFilter)
    .pipe(replace(/(Plugin Name:) Zip Recipes/, "$1 Zip Recipes Lover"))
    .pipe(mainPluginFileFilter.restore)

    // move files to destination
    .pipe(gulp.dest(dest_premium_lover))
});

/**
 *  Task to build premium (admirer plan) version of Zip Recipes.
 */
gulp.task("build-premium-admirer", function () {
    // used to rename premium readme file
    var premiumFileFilter = filter('PREMIUM_README.md', {restore: true});

    // used to change plugin name to Zip Recipes premium
    var mainPluginFileFilter = filter('zip-recipes.php', {restore: true});

    return gulp.src([
        "src/**",
        "!src/README.md",
        "!src/composer.*",
        "!node_modules/**",
        "!src/vendor-dev/**",
        "!src/vendor-dev",
        "LICENSE",
        "!src/plugins/**"
    ])
    // rename premium read me
        .pipe(premiumFileFilter)
        .pipe(rename("README.md"))
        .pipe(premiumFileFilter.restore)

        // replace plugin name to premium
        .pipe(mainPluginFileFilter)
        .pipe(replace(/(Plugin Name:) Zip Recipes/, "$1 Zip Recipes Admirer"))
        .pipe(mainPluginFileFilter.restore)

        // move files to destination
        .pipe(gulp.dest(dest_premium_admirer))
});

/**
 *  Task to build premium (friend plan) version of Zip Recipes.
 */
gulp.task("build-premium-friend", function () {
    // used to rename premium readme file
    var premiumFileFilter = filter('PREMIUM_README.md', {restore: true});

    // used to change plugin name to Zip Recipes premium
    var mainPluginFileFilter = filter('zip-recipes.php', {restore: true});

    return gulp.src([
        "src/**",
        "!src/README.md",
        "!src/composer.*",
        "!node_modules/**",
        "!src/vendor-dev/**",
        "!src/vendor-dev",
        "LICENSE",
        "!src/plugins/**"
    ])
    // rename premium read me
        .pipe(premiumFileFilter)
        .pipe(rename("README.md"))
        .pipe(premiumFileFilter.restore)

        // replace plugin name to premium
        .pipe(mainPluginFileFilter)
        .pipe(replace(/(Plugin Name:) Zip Recipes/, "$1 Zip Recipes Friend"))
        .pipe(mainPluginFileFilter.restore)

        // move files to destination
        .pipe(gulp.dest(dest_premium_friend))
});


gulp.task("compress-premium-lover", function () {
  return gulp.src(path.join(dest_premium_lover, "**"))
    .pipe(zip("zip-recipes-lover.zip"))
    .pipe(gulp.dest("build/"));
});

gulp.task("compress-premium-admirer", function () {
    return gulp.src(path.join(dest_premium_admirer, "**"))
        .pipe(zip("zip-recipes-admirer.zip"))
        .pipe(gulp.dest("build/"));
});

gulp.task("compress-premium-friend", function () {
    return gulp.src(path.join(dest_premium_friend, "**"))
        .pipe(zip("zip-recipes-friend.zip"))
        .pipe(gulp.dest("build/"));
});

gulp.task("plugins-free", function () {
  // Ship UsageStats plugin with free version
  return gulp.src(["src/plugins/index.php", "src/plugins/UsageStats/**"], {base: "src"})
    .pipe(gulp.dest(dest_free));
});

gulp.task("plugins-premium-lover", function () {
  // Don't ship UsageStats plugin with premium version
  return gulp.src(["src/plugins/**", "!src/plugins/{UsageStats,UsageStats/**}"], {base: "src"})
    .pipe(gulp.dest(dest_premium_lover));
});

gulp.task("plugins-premium-admirer", function () {
    // Don't ship UsageStats plugin with premium version
    return gulp.src(["src/plugins/**", "!src/plugins/{RecipeGrid,RecipeGrid/**,UsageStats,UsageStats/**,RecipeActions,RecipeActions/**,AutomaticNutrition,AutomaticNutrition/**,ServingAdjustment,ServingAdjustment/**,RecipeReviews,RecipeReviews/**}"], {base: "src"})
        .pipe(gulp.dest(dest_premium_admirer));
});

gulp.task("plugins-premium-friend", function () {
    // Don't ship UsageStats plugin with premium version
    return gulp.src(["src/plugins/**", "!src/plugins/{RecipeSearch,RecipeSearch/**,Import,Import/**,RecipeGrid,RecipeGrid/**,UsageStats,UsageStats/**,RecipeActions,RecipeActions/**,AutomaticNutrition,AutomaticNutrition/**,ServingAdjustment,ServingAdjustment/**,RecipeReviews,RecipeReviews/**}"], {base: "src"})
        .pipe(gulp.dest(dest_premium_friend));
});

gulp.task("build-free", function () {
  return gulp.src([
    "src/**",
    "!src/PREMIUM_README.md",
    "!src/composer.*",
    "!node_modules/**",
    "!src/vendor-dev/**",
    "!src/vendor-dev",
    "LICENSE",
    "!src/plugins/**"
  ])
    // move files to destination
    .pipe(gulp.dest(dest_free));
});

gulp.task("compress-free", function () {
  return gulp.src(path.join(dest_free, "**"))
    .pipe(zip("zip-recipes.zip"))
    .pipe(gulp.dest("build/"));
});

/**
 * Renames vendor to vendor-dev if if it exists because vendor contains dev packages as well
 */
gulp.task('vendor-rename-pre', function (done) {
    fs.rename('src/vendor', 'src/vendor-dev', function (err) {
    if (err) {
      console.log("Can't rename `vendor` to `vendor-dev`.");
    }
    done();
  });
});

/**
 * Renames vendor-dev to vendor if if it exists. Removes `vendor` contents
 * This restores vendor name for vendor packages that include dev packages
 */
gulp.task('vendor-rename-post', function (done) {
  del('src/vendor/**')
    .then(function () {
                return fs.rename('src/vendor-dev', 'src/vendor', function (err) {
        if (err) {
          console.log("Couldn't rename `vendor-dev` to `vendor`");
        }
      });
    })
            .catch(function () {
      console.log("Could not delete `src/vendor/`");
    })
    .then(function () {
      done();
    });
});


/**
 * Run composer install --no-dev in src dir.
 */
gulp.task('composer-install', shell.task([
    'cd src && php ../composer.phar install --no-dev'
]));

/**
 * Run composer install (includes dev packages)
 */
gulp.task('composer-dev-install', shell.task([
  'cd src && php ../composer.phar install'
]));

/**
 * Task to build free version of Zip Recipes.
 */
gulp.task("free-sequence", function (cb) {
  return sequence(
      "sassForGutenberg",
    ["plugins-free"],
    "build-free",
    "compress-free",
    cb);
});

gulp.task("premium-sequence-lover", function (cb) {
  return sequence(
      "sassForGutenberg",
      "recipegridSaas",
       "custom-templates", // build CustomTemplates plugin
      ["plugins-premium-lover", "gutenbergWithAuthorAndNutrition"],
      "build-premium-lover",
      "compress-premium-lover",
    cb);
});

gulp.task("premium-sequence-admirer", function (cb) {
    return sequence(
        "sassForGutenberg",
        "recipegridSaas",
        // "addAuthorBlock", // replace author.jsx with proper author.jsx content from author/gutenberg/author.jsx
        "custom-templates", // build CustomTemplates plugin
        ["plugins-premium-admirer", "gutenbergWithAuthor"],
        "build-premium-admirer",
        "compress-premium-admirer",
        cb);
});

gulp.task("premium-sequence-friend", function (cb) {
    return sequence(
        "sassForGutenberg",
        "recipegridSaas",
        // "addAuthorBlock", // replace author.jsx with proper author.jsx content from author/gutenberg/author.jsx
        "custom-templates", // build CustomTemplates plugin
        ["plugins-premium-friend", "gutenbergWithAuthor"],
        "build-premium-friend",
        "compress-premium-friend",
        cb);
});
/**
 * Task to build free and premium versions.
 */
gulp.task("build", function (cb) {
  // we need to rename vendor to vendor-dev because we don't want to ship vendor dev
  return sequence(
    "clean",
    "composer-dev-install",
    "i18n", // needs vendor to include dev packages
    "vendor-rename-pre",
    "composer-install",
    "vendor-cleanup",
    ["compress-assets", "sassForMain", "sassForGutenberg"],
      "gutenberg",
      "free-sequence", "premium-sequence-lover", "premium-sequence-admirer", "premium-sequence-friend",
    "vendor-rename-post",
    cb);
});

/**
 * Remove dev file/folder that take too much space (e.g. docs) from vendor folder.
 * We don't need to ship these.
 */
gulp.task("vendor-cleanup", function (done) {
    del('./src/vendor/twbs/bootstrap/docs')
            .catch(function () {
            console.log("Could not clean rm src/vendor/twbs/bootstrap/docs");
        })
        .then(function () {
            done();
        });
});

gulp.task("clean", function () {
  return del(build_path);
});

/**
 * Generate translation template (pot) file.
 */
gulp.task("generate-pot", function (done) {
  var twigFileFilter = filter(['**/*.twig'], {restore: true});
  var phpFileFilter = filter(['**/*.php'], {restore: true});

  // remove all contents of template file because it will not update strings
  require('fs').writeFileSync(translationTemplateFilePath, '');

  // Extract twig strings
  return gulp.src(["src/**/*.php", "src/**/*.twig", "!src/vendor/**", "!src/vendor-dev/**"], {read: false})
    .pipe(twigFileFilter)
      .pipe(debug())
    .pipe(shell([
      `./src/vendor/bin/twig-gettext-extractor --sort-output --join-existing --output='${translationTemplateFilePath}' -L PHP --from-code='UTF-8' --default-domain='zip-recipes' --package-name="zip-recipes" --msgid-bugs-address="hello@ziprecipes.net" --copyright-holder="Zip Recipes Ltd" --keyword='__' --no-location --files <%= relativePath(file.path) %>`
    ], {templateData: {
      // Return relative path, given absolute one. Needed by twig-gettext-extractor
      relativePath: function (absolutePath) {
        var relPath = path.relative('.', absolutePath);
        return relPath;
      }
    }}, done))
    .pipe(twigFileFilter.restore)
    .pipe(phpFileFilter)
      .pipe(debug())
    .pipe(shell([
      `xgettext --sort-output --join-existing --output='${translationTemplateFilePath}' --from-code='UTF-8' --default-domain='zip-recipes' --keyword='__' --no-location --package-name="zip-recipes" --msgid-bugs-address="hello@ziprecipes.net" --copyright-holder="Zip Recipes Ltd" <%= file.path %>`
    ]))
  .pipe(phpFileFilter.restore);
});

/**
 * Copy translation template into all languages.
 */
gulp.task('update-languages', function (done) {
  return gulp.src('./src/languages/*.po')
    .pipe(shell([`msgmerge -U <%= file.path %> ${translationTemplateFilePath}`])); // {verbose: true} to see details
});

/**
 * Generate binary translation files (mo)
 */
gulp.task('generate-mos', function (done) {
  return gulp.src('./src/languages/*.po')
    // msgfmt uses -f to also take fuzzy matches into account when converting to mo.
    .pipe(shell([`msgfmt -f --output-file='./src/languages/<%= mo(file.path) %>' <%= file.path %>`
            ], {verbose: true, templateData:
    {
                            mo: function (path) {
        return path.replace(/.+\/([a-zA-Z0-9-_]+)\.po/, '$1.mo');
      }
    }
    }));
});

gulp.task('i18n', function (done) {
  return sequence(
    "generate-pot",
    "update-languages",
    "generate-mos",
    done);
});


/**
 * CustomTemplates plugin tasks
 */

function sassForPlugin(pluginName) {
    return function () {
        var path = ext_location + pluginName + assets_parent;
        var path_style = ext_location + pluginName + '/';
        console.log(path + 'assets/sass/*.scss');
        return gulp.src(path + 'assets/sass/*.scss')
            .pipe(sass({
                includePaths: [modules],
                outputStyle: 'compressed'
            }).on('error', sass.logError))
                .pipe(gulp.dest(path_style + 'styles'));
    }
}

gulp.task('customTemplatesSaas', sassForPlugin('CustomTemplates'));
gulp.task('recipegridSaas', sassForPlugin('RecipeGrid'));

gulp.task('customTemplatesJS', function (cb) {
    var dir_name = "CustomTemplates";
    var path = ext_location + dir_name + assets_parent;

    return gulp.src(path + 'assets/js/*.js')
            .pipe(gulp.dest(path + 'js'));
});

gulp.task('customTemplatesFonts', function (cb) {
    var dir_name = "CustomTemplates";
    var path = ext_location + dir_name + assets_parent;
    return gulp.src(path + 'assets/fonts/*')
            .pipe(gulp.dest(path + 'fonts'));
});

gulp.task('customTemplatesImages', function (cb) {
    var dir_name = "CustomTemplates";
    var path = ext_location + dir_name + assets_parent;
    return gulp.src(path + 'assets/images/*')
            .pipe(gulp.dest(path + 'images'));
});

gulp.task('custom-templates',
    ['customTemplatesSaas', 'customTemplatesJS', 'customTemplatesFonts', 'customTemplatesImages']
);

gulp.task('sassForMain', function (cb) {
    return gulp.src('src/styles/*.scss')
        .pipe(sass({
            includePaths: [modules],
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('src/styles/'));
});


gulp.task('sassForGutenberg', function (cb) {
    return gulp.src('src/gutenberg/assets/styles/*.scss')
        .pipe(sass({
            includePaths: [modules],
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('src/gutenberg/assets/styles/'));
});


function getFolders(dir) {
    return fs.readdirSync(dir)
            .filter(function (file) {
                return fs.statSync(path.join(dir, file)).isDirectory();
            });
}

function createErrorHandler(name) {
    return function (err) {
        console.error('Error from ' + name + ' in compress task', err.toString());
    };
}

gulp.task('gutenberg-webpack-dev', function () {
    return gulp.src('src/gutenberg/blocks/recipe.jsx')
        .pipe(gulpWebpack({
            mode: 'development',
            watch: true,
            devtool: 'source-map',
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        use: 'babel-loader'
                    }
                ]
            },
            resolve: {
                extensions: ['.jsx', '.js']
            },
            output: {
                filename: 'recipe.min.js',
                path: path.resolve(__dirname, 'build')
                // libraryTarget: 'var',
                // library: 'ZrdnServingAdjustment'
            }
        }, webpack))
        .pipe(gulp.dest('src/gutenberg/build/'));
});

// Disable author promos - pre
gulp.task('add-promos-pre', function (done) {
    fs.renameSync('src/gutenberg/blocks/promos.jsx', 'src/gutenberg/blocks/promos.tmp.jsx');
    fs.renameSync('src/plugins/Authors/gutenberg/promos.jsx', 'src/gutenberg/blocks/promos.jsx');
    done();
});

// Disable author promos - post
gulp.task('add-promos-post', function (done) {
    fs.renameSync('src/gutenberg/blocks/promos.jsx', 'src/plugins/Authors/gutenberg/promos.jsx');
    fs.renameSync('src/gutenberg/blocks/promos.tmp.jsx', 'src/gutenberg/blocks/promos.jsx', '');
    done();
});

gulp.task('add-author-pre', function (done) {
    fs.renameSync('src/gutenberg/blocks/author.jsx', 'src/gutenberg/blocks/author.tmp.jsx');
    fs.renameSync('src/plugins/Authors/gutenberg/author.jsx', 'src/gutenberg/blocks/author.jsx');
    done();
});

gulp.task('add-author-post', function (done) {
    fs.renameSync('src/gutenberg/blocks/author.jsx', 'src/plugins/Authors/gutenberg/author.jsx');
    fs.renameSync('src/gutenberg/blocks/author.tmp.jsx', 'src/gutenberg/blocks/author.jsx', '');
    done();
});

gulp.task('add-nutrition-pre', function (done) {
    fs.renameSync('src/gutenberg/blocks/nutrition_calculator.jsx', 'src/gutenberg/blocks/nutrition_calculator.tmp.jsx');
    fs.renameSync('src/plugins/AutomaticNutrition/gutenberg/nutrition_calculator.jsx', 'src/gutenberg/blocks/nutrition_calculator.jsx');
    done();
});

gulp.task('add-nutrition-post', function (done) {
    fs.renameSync('src/gutenberg/blocks/nutrition_calculator.jsx', 'src/plugins/AutomaticNutrition/gutenberg/nutrition_calculator.jsx');
    fs.renameSync('src/gutenberg/blocks/nutrition_calculator.tmp.jsx', 'src/gutenberg/blocks/nutrition_calculator.jsx');
    done();
});


gulp.task('gutenbergWithAuthor', function(cb) {
    return sequence(
        'add-author-pre',
        'add-promos-pre',
        'gutenberg-webpack-prod',
        'add-author-post',
        'add-promos-post',
        cb);
});

gulp.task('gutenberg', function(cb) {
    return sequence(
        'gutenberg-webpack-prod',
        cb);
});

gulp.task('gutenbergWithAuthorAndNutrition', function(cb) {
    return sequence(
        'add-author-pre',
        'add-promos-pre',
        'add-nutrition-pre',
        'gutenberg-webpack-prod',
        'add-author-post',
        'add-promos-post',
        'add-nutrition-post',
        cb);
});

gulp.task('gutenberg-webpack-prod', function () {
    return gulp.src('src/gutenberg/blocks/recipe.jsx')
        .pipe(gulpWebpack({
            // mode: 'production',
            mode: 'development',
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        use: 'babel-loader'
                    }
                ]
            },
            resolve: {
                extensions: [ '.jsx', '.js' ]
            },
            output: {
                filename: 'recipe.min.js',
                path: path.resolve(__dirname, 'build')
                // libraryTarget: 'var',
                // library: 'ZrdnServingAdjustment'
            }
        }, webpack))
        .pipe(gulp.dest('src/gutenberg/build/'));
});

gulp.task('servingadjustment-webpack-prod', function () {
    return gulp.src('src/plugins/ServingAdjustment/src/index.ts')
        .pipe(gulpWebpack({
            mode: 'production',
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
                    }
                ]
            },
            resolve: {
                extensions: [ '.tsx', '.ts', '.js' ]
            },
            output: {
                filename: 'index.min.js',
                path: path.resolve(__dirname, 'build'),
                libraryTarget: 'var',
                library: 'ZrdnServingAdjustment'
            }
        }, webpack))
        .pipe(gulp.dest('src/plugins/ServingAdjustment/build/'));
});

gulp.task('servingadjustment-webpack-dev', function (cb) {
    return gulp.src('src/plugins/ServingAdjustment/src/index.ts')
        .pipe(gulpWebpack({
            mode: 'development',
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
                    }
                ]
            },
            resolve: {
                extensions: [ '.tsx', '.ts', '.js' ]
            },
            output: {
                filename: 'index.js',
                path: path.resolve(__dirname, 'build'),
                libraryTarget: 'var',
                library: 'ZrdnServingAdjustment'
            }
        }, webpack))
        .pipe(gulp.dest('src/plugins/ServingAdjustment/build/'));
});

gulp.task('servingadjustment-webpack', ['servingadjustment-webpack-dev', 'servingadjustment-webpack-prod']);

/**
 * Uglify, minify and compress js
 * 
 * It Process all main plugin js and extensions js
 */
gulp.task('compress-js', function () {
    log.info('JS compress process started for extensions...');
    var folders = getFolders(ext_location);

    // remove ServingAdjustment folder
    folders = folders.filter(function (fol) { return fol !== 'ServingAdjustment'; });

    log.info('All extensions loaded.');
    var tasks = folders.map(function (folder) {
        log.info('working on ' + folder);
        var dis_path = ext_location + folder + '/';
        return gulp.src([
            path.join(ext_location, folder, '/**/*.js'),
            '!' + path.join(ext_location, folder, '/**/*.min.js')
        ])
                // minify
                .pipe(uglify())
                .on('error', createErrorHandler('uglify js ' + ext_location))
                .pipe(rename({
                    suffix: '.min'
                }))
                // write to output again
                .pipe(gulp.dest(dis_path))
            .on('error', createErrorHandler('dest js ' + ext_location));
        });

    log.info('JS compress process started for root...');
    // process all remaining files in scriptsPath root into main.js and not main.min.js files
    var root = gulp.src(['src/scripts/*.js', '!src/scripts/*.min.js'])
            .pipe(uglify())
            .on('error', createErrorHandler('uglyify js'))
            .pipe(rename({
                suffix: '.min'
            }))
            // write to output again
            .pipe(gulp.dest('src/scripts/'))
            .on('error', createErrorHandler('dest js'));

    return merge(tasks, root);
});

/**
 * Uglify, minify and compress css
 * 
 * It Process all main plugin css and extensions css
 */
gulp.task('compress-css', function () {
    log.info('CSS compress process started for extensions...');
    var folders = getFolders(ext_location);
    log.info('All extensions loaded.');
    var tasks = folders.map(function (folder) {
        log.info('working on ' + folder);
        var dis_path = ext_location + folder + '/';
        log.warn('path: ' + dis_path);
        return gulp.src([path.join(ext_location, folder, '/**/**.css'), '!' + path.join(ext_location, folder, '/**/*.min.css')])
                // clean css
                .pipe(cleanCSS())
                // minify css
                .pipe(minifyCSS())
                .pipe(prefix('last 2 versions'))
                // rename to .min.css
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(gulp.dest(dis_path))
                .on('error', createErrorHandler('css dest ' + folder));

    });
    log.info('CSS compress process started for root...');
    // process all remaining files in stylesPath root into main.css and main.min.css files
    var root = gulp.src(['src/styles/*.css', '!src/styles/*.min.css'])
            // clean css
            .pipe(cleanCSS())
            // minify css
            .pipe(minifyCSS())
            .pipe(prefix('last 2 versions'))
            // rename to .min.css
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('src/styles/'))
        .on('error', createErrorHandler('css dest'));
    return merge(tasks, root);
});

/**
 * Uglify, minify and compress css/jss
 * 
 * It Process all main plugin css/jss and extensions css/jss
 */
gulp.task("compress-assets", function (cb) {
    return sequence(
        'custom-templates',
        ['servingadjustment-webpack', 'compress-js', 'compress-css'],
        cb);
});
