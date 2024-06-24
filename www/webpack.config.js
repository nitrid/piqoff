const path = require("path");
const webpack = require("webpack");
const htmlWebPackPlugin = require('html-webpack-plugin');
const copyPlugin = require("copy-webpack-plugin");
const zipPlugin = require('zip-webpack-plugin');
const removePlugin = require('remove-files-webpack-plugin');

const crypto = require('crypto');
const fs = require('fs');
const pack = require('./package.json')
const fileBuffer = fs.readFileSync('./src/core/cls/scale.js')
const hashSum = crypto.createHash('sha256');

hashSum.update(fileBuffer);
const hex = hashSum.digest('hex');

// if(pack.scale.sha != hex)
// {
//     console.log("invalide scale.js - ")
//     return
// }

module.exports = 
{
    entry: 
    {
        admin: './src/admin/index.js',
        off: './src/off/index.js',
        pos: './src/pos/index.js',
        mob: './src/mob/index.js',
        tab: './src/tab/index.js',
        boss: './src/boss/index.js'
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
            },
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
        extensions: ["*", ".js", ".jsx", ".json"]
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
            },
            {
                directory: path.join(__dirname, "public/tab")
            },
            {
                directory: path.join(__dirname, "public/boss")
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
                { from: "./src/pos/resources/", to: "./pos/resources/" },
                { from: "./src/pos/appUpdate.html", to: "./pos/appUpdate.html" },
                { from: "./src/pos/css/bootstrap.min.css", to: "./pos/css/bootstrap.min.css" },
                { from: "./src/pos/lib/bootstrap.bundle.min.js", to: "./pos/lib/bootstrap.bundle.min.js" },
                { from: "./src/off/css/img/", to: "./off/css/img/" },
                { from: "./src/off/css/icons/", to: "./off/css/icons/" },
                { from: "./src/off/css/icons/", to: "./off/css/icons/" },
                { from: "./src/off/printview.html", to: "./off/printview.html" },
                { from: "./src/off/sound/", to: "./off/sound/" },
                { from: "./src/off/resources/", to: "./off/resources/" },
                { from: "./src/mob/css/img/", to: "./mob/css/img/" },
                { from: "./src/mob/css/icons/", to: "./mob/css/icons/" },
                { from: "./src/mob/sound/", to: "./mob/sound/" },
                { from: "./src/mob/appUpdate.html", to: "./mob/appUpdate.html" },
                { from: "./src/mob/css/bootstrap.min.css", to: "./mob/css/bootstrap.min.css" },
                { from: "./src/mob/lib/bootstrap.bundle.min.js", to: "./mob/lib/bootstrap.bundle.min.js" },
                { from: "./src/tab/css/", to: "./tab/css/" },
                { from: "./src/tab/lib/pdf", to: "./tab/lib/pdf" },
                { from: "./src/tab/appUpdate.html", to: "./tab/appUpdate.html" },
                { from: "./src/tab/lib/bootstrap.bundle.min.js", to: "./tab/lib/bootstrap.bundle.min.js" },     
                { from: "./src/boss/css/img/", to: "./boss/css/img/" },
                { from: "./src/boss/css/icons/", to: "./boss/css/icons/" },
                { from: "./src/boss/sound/", to: "./boss/sound/" },
                { from: "./src/boss/appUpdate.html", to: "./boss/appUpdate.html" },
                { from: "./src/boss/css/bootstrap.min.css", to: "./boss/css/bootstrap.min.css" },
                { from: "./src/boss/lib/bootstrap.bundle.min.js", to: "./boss/lib/bootstrap.bundle.min.js" },    
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
        new htmlWebPackPlugin(
        {
            template: './src/tab/index.html',
            filename: 'tab/index.html',
            chunks: ['tab']
        }),
        new htmlWebPackPlugin(
        {
            template: './src/boss/index.html',
            filename: 'boss/index.html',
            chunks: ['boss']
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
        }),
    ]
};