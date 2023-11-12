const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development', // or 'production'
  entry: './src/weatherApp.js', // this is the path of the main JavaScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // this is the desired output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'), // this is the desired output directory
    open: true,
  },
};
