



const path = require('path');

module.exports = {
  entry: './src/js/app',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.dmap$/,
        type: 'asset/source'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css']
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'src')
    },
    hot: true,
    port: 9090,
    host: '0.0.0.0',
    historyApiFallback: true
  }
}
