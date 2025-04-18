import * as path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import process from 'process';
import pkg from './package.json' assert { type: 'json' };

export default {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'pack.js',
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: pkg.productName,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', {
                runtime: 'automatic',
              }],
            ],
          },
        },
      },
      {
        test: /assets/i,
        type: 'asset',
      },
    ],
  },
};
