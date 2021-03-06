var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var minifyCss = require('gulp-minify-css');//CSSファイルの圧縮ツール
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var twig = require("gulp-twig");//Twigテンプレートエンジン
var browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'broccoli-field-image-editor.js',
	'test/main.js',
	'copy',
];

// broccoli-field-image-editor.js (front側) を処理
gulp.task("broccoli-field-image-editor.js", function() {
	gulp.src(["src/broccoli-field-image-editor.js"])
		.pipe(plumber())
		.pipe(browserify({}))
		.pipe(concat('broccoli-field-image-editor.js'))
		.pipe(gulp.dest( './dist/' ))
		.pipe(gulp.dest( './tests/testdata/htdocs/libs/' ))
		.pipe(concat('broccoli-field-image-editor.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest( './dist/' ))
		.pipe(gulp.dest( './tests/testdata/htdocs/libs/' ))
	;
});

// test/main.js を処理
gulp.task("test/main.js", function() {
	gulp.src(["tests/testdata/htdocs/index_files/main.src.js"])
		.pipe(plumber())
		.pipe(browserify({}))
		.pipe(concat('main.js'))
		.pipe(uglify()) // 難読化
		.pipe(gulp.dest( './tests/testdata/htdocs/index_files/' ))
	;
});

gulp.task("copy", function() {
	gulp.src(["./libs/css/**/*"])
		.pipe(gulp.dest( './tests/testdata/htdocs/libs/imageeditor/css/')) // テスト用
		.pipe(gulp.dest( './dist/css/' )) // 本番用
	;
	gulp.src(["./libs/js/**/*"])
		.pipe(gulp.dest( './tests/testdata/htdocs/libs/imageeditor/js/')) // テスト用
		.pipe(gulp.dest( './dist/js/' )) // 本番用
	;
	gulp.src(["./libs/img/**/*"])
		.pipe(gulp.dest( './tests/testdata/htdocs/libs/imageeditor/img/')) // テスト用
		.pipe(gulp.dest( './dist/img/' )) // 本番用
	;
});

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*","libs/**/*","tests/testdata/htdocs/index_files/*.src.js"], _tasks);

//	var port = packageJson.baobabConfig.defaultPort;
//	var svrCtrl = require('baobab-fw').createSvrCtrl();
//	svrCtrl.boot(function(){
//		require('child_process').spawn('open',[svrCtrl.getUrl()]);
//	});
});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
