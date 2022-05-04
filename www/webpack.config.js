const path = require("path");
const webpack = require("webpack");
const htmlWebPackPlugin = require('html-webpack-plugin');
const copyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = 
{
    entry: 
    {
        admin: './src/admin/index.js',
        off: './src/off/index.js',
        pos: './src/pos/index.js',
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
        new CleanWebpackPlugin(),
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
    ]
};