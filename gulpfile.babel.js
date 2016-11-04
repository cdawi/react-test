import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import eslint from 'gulp-eslint';
import webpack from 'webpack-stream';
import webpackConfig from './webpack.config.babel';
import mocha from 'gulp-mocha';
import {Server} from 'karma';


const paths = {
    allSrcJs: 'src/**/*.js',
    serverSrcJs: 'src/server/**/*.js?(x)',
    sharedSrcJs: 'src/shared/**/*.js?(x)',
    clientEntryPoint: 'src/client/app.jsx',
    gulpFile: 'gulpfile.babel.js',
    webpackFile: 'webpack.config.babel.js',
    distDir: 'dist',
    testDistDit: 'dist-tests',
    libDir: 'lib',
    clientBundle: 'dist/client-bundle.js?(.map)',
    allLibTests: 'lib/test/**/*.js'
};

gulp.task('clean', () => {
    return del(paths.libDir, paths.clientBundle);
});

gulp.task('lint', () => {
    return gulp.src([
            paths.allSrcJs,
            paths.gulpFile,
            paths.webpackFile
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', ['clean', 'lint'], () => {
    return gulp.src(paths.allSrcJs)
        .pipe(babel())
        .pipe(gulp.dest(paths.libDir));
});

gulp.task('main', [], () =>
    gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.distDir)));

gulp.task('watch', () => {
    gulp.watch(paths.allSrcJs, ['main']);
});

gulp.task('test', ['build'], () =>
    gulp.src(paths.allLibTests)
    .pipe(mocha())
);

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
  }, done).start();
});

gulp.task('default', ['watch', 'main']);