const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "production",
  entry: {
    "options.style": "./src/scss/options.scss",
    "popup.style": "./src/scss/popup.scss",
    background: "./src/js/background.js",
    popup: ["./src/js/neatools.js", "./src/js/popup.js"],
    options: ["./src/js/neatools.js", "./src/js/options.js"],
    manifest: "./src/manifest.json",
    popup: "./src/popup.html",
    options: "./src/options.html"
  },
  plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([
        {from:'src/images',to:'images'},
        {from:'src/_locales',to:'_locales'},
    ]),
    ],
  output: {
    path: path.resolve(__dirname, "dist")
    //   filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].css",
              outputPath: "css"
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
        test: /\.svg$/,
        use: [
          {
            loader: "file-loader",
            options: { name: "[name].svg", outputPath: "images" }
          }
        ]
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "file-loader",
            options: { name: "[name].png", outputPath: "images" }
          }
        ]
      }
    ]
  }
};
