'use strict';

// CONFIG
import GLOBALCONFIG from './gulp.config.json';

// BUILT-IN MODULES
import path from 'path';

// TOOL
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import merge from 'merge-stream';
import buffer from 'vinyl-buffer';
import runSequence from 'run-sequence';

// JS
import webpack from 'webpack-stream';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

// IMG
import imageMin from 'gulp-imagemin';
import sprite from 'gulp.spritesmith';

// LOCAL SERVER
const browserSync = require('browser-sync').create();
const reload      = browserSync.reload;

//[*]+---------------[[ html 파일 복사 ]]---------------+[*]
gulp.task('file-copy', () => {
  return gulp.src(GLOBALCONFIG.DIRECTION.SRC + '/index.html')
    .pipe(gulp.dest(GLOBALCONFIG.DIRECTION.DIST + '/'));
})

//[*]+---------------[[ html 파일 복사 ]]---------------+[*]

//[*]+---------------[[ Webpack 컴파일 ]]---------------+[*]

gulp.task('webpack-compile', () => {
  return gulp.src(GLOBALCONFIG.DIRECTION.SRC + GLOBALCONFIG.DIRECTION.WEBPACK)
    .pipe(plumber())
    .pipe(webpack({
      entry: {
        [GLOBALCONFIG.WEBPACK.FILENAME]: `./${GLOBALCONFIG.DIRECTION.SRC}${GLOBALCONFIG.DIRECTION.WEBPACK}/${GLOBALCONFIG.WEBPACK.FILENAME}.js`
      },
      output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].build.js'
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'vue-style-loader',
              'css-loader'
            ],
          },
          {
            test: /\.scss$/,
            use: [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
          },
          {
            test: /\.sass$/,
            use: [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ],
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
              loaders: {
                // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                // the "scss" and "sass" values for the lang attribute to the right configs here.
                // other preprocessors should work out of the box, no loader config like this necessary.
                'scss': [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ],
                'sass': [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader?indentedSyntax'
                ]
              },
              postcss: [
                require('autoprefixer')(),
                require('postcss-sorting')({
                  'properties-order': 'alphabetical'
                }),
                require('cssnano')({
                  preset: 'default'
                })
              ]
            }
          },
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          'globalSass': path.resolve(__dirname, './src/scss/index.scss')
        },
        extensions: ['*', '.js', '.vue', '.json']
      },
      devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true
      },
      performance: {
        hints: false
      },
      devtool: '#eval-source-map',
      plugins: [
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            ecma: 8
          }
        })
      ]
    }))
    .pipe(gulp.dest(GLOBALCONFIG.DIRECTION.DIST + '/js'))
    .pipe(reload({stream: true}));
});
//[*]+---------------[[ Webpack 컴파일 ]]---------------+[*]

//[*]+---------------[[ 이미지 압축 ]]---------------+[*]
gulp.task('img-min', () => {
  return gulp.src([GLOBALCONFIG.DIRECTION.SRC + GLOBALCONFIG.DIRECTION.IMAGE + '/!(sprites)*', GLOBALCONFIG.DIRECTION.SRC + GLOBALCONFIG.DIRECTION.IMAGE + '/!(sprites)*/**/*'])
    .pipe(plumber())
    .pipe(imageMin())
    .pipe(gulp.dest(GLOBALCONFIG.DIRECTION.DIST + '/images'))
    .pipe(reload({stream: true}));
});
//[*]+---------------[[ 이미지 압축 ]]---------------+[*]

//[*]+---------------[[ 스프라이트 이미지 생성 ]]---------------+[*]
gulp.task('img-sprite', () => {
  let spriteData = gulp.src(GLOBALCONFIG.DIRECTION.SRC + GLOBALCONFIG.DIRECTION.IMAGE + '/sprites/**/*.png')
    .pipe(plumber())
    .pipe(sprite({
      imgName: GLOBALCONFIG.SPRITE.DISTFILENAME,
      cssName: '_sprite.scss',
      imgPath: '/images/' + GLOBALCONFIG.SPRITE.DISTFILENAME,
      padding: 5 // 스프라이트 이미지 간의 간격 조절
    }));

let imgStream = spriteData.img
  .pipe(buffer())
  .pipe(imageMin())
  .pipe(gulp.dest(GLOBALCONFIG.DIRECTION.DIST + '/images'));

let cssStream = spriteData.css
  .pipe(gulp.dest(GLOBALCONFIG.DIRECTION.SRC + GLOBALCONFIG.DIRECTION.SCSS + '/components/sprite'))
  .pipe(reload({stream: true}));

return merge(imgStream, cssStream);
});
//[*]+---------------[[ 스프라이트 이미지 생성 ]]---------------+[*]


//[*]+---------------[[ 로컬서버 실행 후 파일 변경 감지 ]]---------------+[*]
gulp.task('server-run', () => {
  browserSync.init({
  server: GLOBALCONFIG.DIRECTION.DIST,
  ghostMode: {
    clicks: true,
    forms: true,
    scroll: true
  }
});

gulp.watch(GLOBALCONFIG.DIRECTION.SRC + '/index.html', ['file-copy']);
gulp.watch(GLOBALCONFIG.DIRECTION.SRC + '/scss/**/*.scss', ['webpack-compile']);
gulp.watch(GLOBALCONFIG.DIRECTION.SRC + GLOBALCONFIG.DIRECTION.WEBPACK + '/**/*', ['webpack-compile']);
gulp.watch([GLOBALCONFIG.DIRECTION.SRC + GLOBALCONFIG.DIRECTION.IMAGE + '/!(sprites)*', GLOBALCONFIG.DIRECTION.SRC + GLOBALCONFIG.DIRECTION.IMAGE + '/!(sprites)*/**/*'], ['img-min']);
gulp.watch(GLOBALCONFIG.DIRECTION.IMAGE + 'sprites/*', ['img-sprite']);
});
//[*]+---------------[[ 로컬서버 실행 후 파일 변경 감지 ]]---------------+[*]


//[*]+---------------[[ GULP 기본, 빌드 명령어 실행 ]]---------------+[*]
gulp.task('build', () => {
  runSequence(
    'file-copy',
    ['img-sprite', 'img-min'],
    'webpack-compile'
);
});

gulp.task('default', () => {
  runSequence(
    'file-copy',
    ['img-sprite', 'img-min'],
    'webpack-compile',
    'server-run'
);
});
//[*]+---------------[[ GULP 기본, 빌드 명령어 실행 ]]---------------+[*]
