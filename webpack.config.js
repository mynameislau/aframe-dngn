// var path = require('path');
// var webpack = require('webpack');
// require('babel-polyfill');
//
// var IS_PRODUCTION = process.env.NODE_ENV === 'production';
//
// var ENTRY_POINTS = [
//   './src/js/app'
// ];
//
// var JS_LOADERS = [
//   'babel?cacheDirectory&presets[]=react,presets[]=es2015,presets[]=stage-0'
// ];
//
// var PLUGINS = [];
// if (IS_PRODUCTION) {
//   // Uglify in production.
//   PLUGINS.push(
//     new webpack.optimize.UglifyJsPlugin({
//       mangle: {
//           except: ['$super', '$', 'exports', 'require']
//       },
//       sourcemap: false
//     })
//   );
// }
//
// module.exports = {
//   entry: ENTRY_POINTS,
//   output: {
//     // Bundle will be served at /bundle.js locally.
//     filename: 'bundle.js',
//     // Bundle will be built at ./src/media/js.
//     path: './build',
//     publicPath: '/',
//   },
//   module: {
//     noParse: [
//       /node_modules\/aframe\/dist\/aframe.js/,
//     ],
//     loaders: [
//       {
//         // JS.
//         exclude: /(node_modules|bower_components)/,
//         loaders: JS_LOADERS,
//         test: /\.jsx?$/,
//       },
//       {
//         test: /\.css$/,
//         loader: 'style-loader!css-loader'
//       },
//       {
//         test: /\.json$/,
//         loader: 'json-loader'
//       },
//       {
//         test: /\.dmap$/,
//         loader: 'raw-loader'
//       }
//     ]
//   },
//   plugins: PLUGINS,
//   resolve: {
//     extensions: ['', '.js', '.json', '.jsx'],
//     fallback: path.join(__dirname, 'node_modules'),
//     modulesDirectories: [
//       'src/js',
//       'node_modules',
//     ]
//   },
//   resolveLoader: {
//     fallback: [path.join(__dirname, 'node_modules')]
//   }
// };








const path = require('path');

module.exports = {
  entry: './src/js/app',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        // include: [path.resolve(__dirname, 'app/js')]
        exclude: /(node_modules|bower_components)/,
        use: {
        loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-0']
          }
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.dmap$/,
        loader: 'raw-loader'
    }],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css'],
  },
  devtool: 'sourcemap',
  context: __dirname,
  target: 'web'
}
