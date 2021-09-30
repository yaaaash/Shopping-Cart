const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const bs = require('browser-sync').create();
const terser = require('gulp-terser');

// Build CSS
function styles() {
    return src('app/css/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(dest('dist', { sourcemaps: '.' }))
        .pipe(bs.stream());
}

// Minify JS
function scripts() {
    return src(['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', 'app/js/script.js'], { sourcemaps: true })
        .pipe(terser())
        .pipe(dest('dist', { sourcemaps: '.' }));
}

// Browesersync task
function bsInit() {
    bs.init({
        server: {
            baseDir: '.'
        }
    });
    watch('app/css//*.scss', styles);
    watch('app/js//.js').on('change', series(scripts, bs.reload));
    watch('./.html').on('change', bs.reload);
}

// Gulp tasks
exports.default = series(
    parallel(styles, scripts),
    bsInit
)

exports.styles = styles;
exports.scripts = scripts;
exports.build = parallel(styles, scripts);