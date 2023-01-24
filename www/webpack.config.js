const path = require("path");
const webpack = require("webpack");
const htmlWebPackPlugin = require('html-webpack-plugin');
const copyPlugin = require("copy-webpack-plugin");
const zipPlugin = require('zip-webpack-plugin');
const removePlugin = require('remove-files-webpack-plugin');

module.exports = 
{
    entry: 
    {
        admin: './src/admin/index.js',
        off: './src/off/index.js',
        pos: './src/pos/index.js',
        mob: './src/mob/index.js',
    },    
    mode: "development",
    module: 
    {
        rules: 
        [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: 
                { 
                    presets: ["@babel/env"],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: 
    { 
        alias: 
        {
            globalize$: path.resolve( __dirname, "node_modules/globalize/dist/globalize.js" ),
            globalize: path.resolve(__dirname, "node_modules/globalize/dist/globalize"),
            cldr$: path.resolve(__dirname, "node_modules/cldrjs/dist/cldr.js"),
            cldr: path.resolve(__dirname, "node_modules/cldrjs/dist/cldr"),
            'escpos': false,
            'escpos-serialport' : false,
            'escpos-screen' : false,
            'escpos-usb' : false,
            'serialport' : false,
            'path' : false
        },
        extensions: ["*", ".js", ".jsx"]
    },
    output: 
    {
        path: path.resolve(__dirname, "public/"),
        filename: '[name].index.js',
        chunkFilename: '[name].index.js'
    },
    devServer: 
    {
        static: 
        [
            {
                directory: path.join(__dirname, "public/admin")
            },
            {
                directory: path.join(__dirname, "public/off")
            },
            {
                directory: path.join(__dirname, "public/pos")
            },
            {
                directory: path.join(__dirname, "public/mob")
            }
        ],
        port: 3000,
        proxy: 
        {
            "/socket.io": 
            {
                target: 'http://localhost',
                ws: true
            }
        }
    },
    plugins: 
    [
        new webpack.HotModuleReplacementPlugin(),
        new copyPlugin(
        {
            patterns: 
            [
                { from: "./src/pos/css/img/", to: "./pos/css/img/" },
                { from: "./src/pos/sound/", to: "./pos/sound/" },
                { from: "./src/off/css/img/", to: "./off/css/img/" },
                { from: "./src/off/css/icons/", to: "./off/css/icons/" },
                { from: "./src/off/css/icons/", to: "./off/css/icons/" },
                { from: "./src/off/printview.html", to: "./off/printview.html" },
                { from: "./src/off/sound/", to: "./off/sound/" },
                { from: "./src/mob/css/img/", to: "./mob/css/img/" },
                { from: "./src/mob/css/icons/", to: "./mob/css/icons/" },
                { from: "./src/mob/appUpdate.html", to: "./mob/appUpdate.html" },
                { from: "./src/mob/sound/", to: "./mob/sound/" },
                { from: "./src/mob/css/bootstrap.min.css", to: "./mob/css/bootstrap.min.css" },
                { from: "./src/mob/lib/bootstrap.bundle.min.js", to: "./mob/lib/bootstrap.bundle.min.js" },
                { from: "./src/mob/lib/socket.io.js", to: "./mob/lib/socket.io.js" },
            ]
        }),
        new htmlWebPackPlugin(
        {
            template: './src/admin/index.html',
            filename: 'admin/index.html',
            chunks: ['admin']
        }),
        new htmlWebPackPlugin(
        {
            template: './src/off/index.html',
            filename: 'off/index.html',
            chunks: ['off']
        }),
        new htmlWebPackPlugin(
        {
            template: './src/pos/index.html',
            filename: 'pos/index.html',
            chunks: ['pos']
        }),
        new htmlWebPackPlugin(
        {
            template: './src/mob/index.html',
            filename: 'mob/index.html',
            chunks: ['mob']
        }),
        new zipPlugin(
        {
            path: './',
            filename: 'public.zip',
            pathPrefix: 'public',
            extension: 'zip'
        }),
        new removePlugin(
        {
            before: 
            {
                include: 
                [
                    './public'
                ]
            }
        })
    ]
};