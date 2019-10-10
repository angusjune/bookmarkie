const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "production",
  entry: {
    "options.style": "./src/scss/options.scss",
    "popup.style": "./src/scss/popup.scss",
    background: "./src/js/background.js",
    popup: "./src/js/popup.js",
    options: "./src/js/options.js",
    manifest: "./src/manifest.json",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: "src/images", to: "images" },
      { from: "_locales/**", to: "./", context: "src/" }
    ]),
    new HtmlWebpackPlugin({
      // filename: 'popup.html',
      template: 'src/popup.html'
    }),
    new HtmlWebpackPlugin({
      // filename: 'options.html',
      template: 'src/options.html'
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].css"
            }
          },
          { loader: "extract-loader" },
          { loader: "css-loader" },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["./node_modules"]
              }
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
          presets: ["@babel/preset-env"]
        }
      },
      {
        type: "javascript/auto",
        test: /\.json$/,
        use: [{ loader: "file-loader", options: { name: "[name].json" } }]
      },
      {
        test: /\.html$/,
        use: [{ loader: "file-loader", options: { name: "[name].html" } }]
      },
      {
        test: /\.(svg|png)/,
        use: [
          {
            loader: "file-loader",
            options: { name: "[name].[ext]", outputPath: "images" }
          }
        ]
      }
    ]
  }
};
