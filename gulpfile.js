"use strict";

const gulp = require('gulp');

const ts = require('gulp-typescript');
const merge = require('merge2');
const mocha = require('gulp-mocha');

const tsProject = ts.createProject('tsconfig.json');

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

gulp.task('default', () => 
    gulp.src('./test/*.js')
        .pipe(mocha())
        .once('error', () => {
            process.exit(1);
        })
        .once('end', () => {
            process.exit();
        })
);