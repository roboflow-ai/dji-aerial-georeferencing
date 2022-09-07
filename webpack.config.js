/*jshint esversion:6*/

const path = require("path");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
var HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const _ = require("lodash");

var dev = process.env.WEBPACK_ENV == "dev";

var plugins = [
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
            "**/*",
            "!images/**",
            "!robots.txt",
            "!favicon.ico"
        ]
    }),
    new HtmlWebpackPlugin({
        filename: "index.html",
        cache: false,
        inject: true
    })
];

if (dev) {
    plugins.push(
        new HtmlWebpackTagsPlugin({ tags: ["/localhost:35729/livereload.js"], append: false })
    );

    plugins.push(new LiveReloadPlugin());
}

plugins.push(
    new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[name].[contenthash].css",
        ignoreOrder: true
    })
);

module.exports = {
    mode: dev ? "development" : "production",
    devtool: dev ? "eval-source-map" : "nosources-source-map",
    optimization: {
        minimizer: dev ? [] : [new CssMinimizerPlugin(), new TerserPlugin()],
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all"
        }
    },
    resolve: {
        extensions: [".js"]
    },
    entry: {
        main: [
            path.resolve(__dirname, "src/main.js"),
            path.resolve(__dirname, "src/main.scss")
        ]
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                loader: "handlebars-loader",
                options: {
                    helperDirs: [__dirname + "/src/scripts/helpers"],
                    knownHelpersOnly: false
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../"
                        }
                    },
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                parser: "postcss-scss"
                            }
                        }
                    }
                ]
            }
        ]
    },
    plugins: plugins,
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/"
    }
};
