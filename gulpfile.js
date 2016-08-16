"use strict";

var gulp = require('gulp');

var ts = require('gulp-typescript');
var merge = require('merge2');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('op:clean', function () {
});

gulp.task('ts:compile', function () {
	var tsResult = tsProject.src()
            .pipe(ts(tsProject));
	
	return merge([
		tsResult.js.pipe(gulp.dest('dist'))
	]);
});

gulp.task('build', ['op:clean', 'ts:compile'], function () {
	gulp.watch(['ts/**/*.ts', 'tsconfig.json'], ['op:clean', 'ts:compile']);
});