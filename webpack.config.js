const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "spa", "index.js"),
  output: {
    path:path.resolve(__dirname, "static/spa/js"),
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  plugins: [
    new Dotenv({
      path: "./.env.admin_spa"
    }),
    new HtmlWebpackPlugin({
      filename: "../../../admin_spa/templates/admin_spa/spa.html",
      template: path.join(__dirname, "templates", "base.html"),
    }),
  ],
}
