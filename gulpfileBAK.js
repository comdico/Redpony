var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    neat = require('node-neat').includePaths,
    bourbon = require("node-bourbon").includePaths,
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    webserver = require('gulp-webserver');

var prefixerOptions = {
  browsers: ['last 4 versions']
};

var paths = {
    scss: 'src/sass/*.scss',
    sassInputFiles: ['src/sass/**/*.scss'],
    cssOutputFolder: 'public/css/',
    jsOutputFolder: 'public/js/',
    htmlInputFiles: ['public/**/*.html']
};

var sassOptions = {
  outputStyle: 'expanded',
  includePaths: ['sass'].concat(bourbon),
  includePaths: ['sass'].concat(neat),
  sourcemap: true
};

var displayError = function(error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin.error.bold + ']';
  errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if(error.fileName)
      errorString += ' in ' + error.fileName;

  if(error.lineNumber)
      errorString += ' on line ' + error.lineNumber.bold;

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
}

var onError = function(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};


// gulp.task('js', function() {
//   return gulp.src('builds/sassEssentials/js/myscript.js')
//     .pipe(jshint('./.jshintrc'))
//     .pipe(jshint.reporter('jshint-stylish'));
// });

gulp.task('sass', function () {
    return gulp.src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(plumber({errorHandler: onError}))
    .pipe(prefix(prefixerOptions))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.cssOutputFolder))
});

gulp.task('watch', function() {
  gulp.watch(paths.sassInputFiles, ['sass']);
});



gulp.task('webserver', function() {
    gulp.src('public/')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('default', ['sass', 'watch', 'webserver']);
