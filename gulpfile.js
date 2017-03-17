var gulp = require('gulp');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var clean = require('gulp-clean');
var bundler;

var themePath = './wp-content/themes/starterdeck';
var siteUrl = 'starterdeck-wp.dev';

function getBundler(src) {

  if (!bundler) {
    bundler = browserify(src, {
      debug: true
    })
    .transform(babelify, { presets: ['es2015'] })
  }
  return bundler;

}

// Bundles and creates both unminified and minified versions
function bundleScripts(outputName, src, outputDir) {

  return getBundler(src)
    .bundle()
    .on('error', function(err) {
      console.log('Error: ' + err);
      this.emit('end');
    })

    // Unminified version
    .pipe(source(outputName))
    .pipe(clean({ read: false }))
    .pipe(gulp.dest(outputDir))
    .pipe(buffer())

}

function buildScripts(src, outputDir) {

  return gulp.src(src)
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(outputDir))
    .on('end', function() {
      process.exit()
    })
}

// Runs core style tasks
function processStyles(src, outputDir) {

  return gulp.src(src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(outputDir))
    // then rename and optimize it
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss({
      relativeTo: outputDir,
      processImport: true
    }))
    .pipe(gulp.dest(outputDir))

}

gulp.task('scripts', function(){
  return bundleScripts(
    'public.js', 
    themePath + '/src/scripts/public.js', 
    themePath + '/dist/scripts/'
  )
});

gulp.task('styles', function(){
  return processStyles(
    themePath + '/src/styles/public.scss', 
    themePath + '/dist/styles/'
  );
});

gulp.task('build', ['scripts','styles'], function() {

  return buildScripts(
    themePath + '/dist/scripts/public.js', 
    themePath + '/dist/scripts/'
  )

});

// Common watch task
gulp.task('watch', function() {

  browserSync.init({
    files: [
      themePath + '/dist/scripts/public.js',
      themePath + '/dist/styles/public.css',
    ],
    proxy: siteUrl
  })

  gulp.watch(themePath + '/src/styles/**/*.scss', ['styles']);
  gulp.watch(themePath + '/src/scripts/**/*.js', ['scripts']);

  // Trigger reloading when any of these files change
  gulp.watch([
    themePath + '/**/*.twig',
    themePath + '/**/*.php'
  ]).on('change', browserSync.reload)

});

// Default Task
gulp.task('default', ['build']);

