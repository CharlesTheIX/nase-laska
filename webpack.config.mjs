import { fileURLToPath } from 'url';
import Dotenv from 'dotenv-webpack';
import path, { dirname } from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  devtool: 'source-map',
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve('dist'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: 'main.css', 
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',                
          'sass-loader',                
        ],
      },
    ],
  },
};

export default config;
