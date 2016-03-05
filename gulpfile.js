var gulp = require('gulp');

var ts = require('gulp-typescript');
var merge = require('merge2');

gulp.task('op:clean', function () {
});

gulp.task('ts:compile', function () {
	var tsResult = gulp.src(['ts/**/*.ts', 'typings/main/**/*.ts'])
            .pipe(ts({
		declaration: true,
		noExternalResolve: true
	}));
	
	return merge([
		tsResult.dts.pipe(gulp.dest('dist/definitions')),
		tsResult.js.pipe(gulp.dest('dist/js'))
	]);
});

gulp.task('build', function () {
	gulp.watch(['ts/**/*.ts'], ['op:clean', 'ts:compile']);
});