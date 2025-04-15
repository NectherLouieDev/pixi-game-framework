const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext][query]'
        }
      }
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
        '@core': path.resolve(__dirname, 'src/core/index.ts'),
        '@px': path.resolve(__dirname, 'src/px/index.ts'),
        '@scenes': path.resolve(__dirname, 'src/px/index.ts')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: 'assets', 
          to: 'assets',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/*.psd', '**/*.ai']
          }
        }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
  },
};