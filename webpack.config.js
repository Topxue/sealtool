/*
 * @Author: ives-xue
 * @Date: 2020-08-05 15:32:07
 * @LastEditTime: 2020-08-24 19:53:44
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  // development
  // devtool: 'cheap-module-eval-source-map',
  // production
  // devtool: 'cheap-eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'seal.min.js',
    publicPath: '/',
  },
  performance: {
    hints: false
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'seal.css'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/dist/css/',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')()]
            }
          }
        ],
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.(jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
        use: [{
          loader: 'url-loader',
          options: {
            outputPath: '/images',
            name: '[name].[ext]',
            limit: 102400,
          },
        }]
      },
      {
        test: /\.js?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/react'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-transform-async-to-generator'],
            ],
          },
        },],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.tpl$/,
        loader: 'ejs-loader?variable=data'
      }
    ],
  },
  devServer: {
    // open: true,
    // sourceMap: false,
    // extract: false,
    contentBase: path.join(__dirname, '../dist/'),
    port: 3000,
    host: 'localhost',
  },
}