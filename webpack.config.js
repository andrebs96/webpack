const path = require('path')
// const webpack = require('webpack')
const glob = require('glob')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require ('html-webpack-plugin')

var master = {
    css: 'css/main.css',
    js: 'js/main.js'
}

var pages = [
    {
        url: /^\/$/,
        file: '/home.html',
        title: 'home',
        css: [master.css, 'css/home.css'],
        js: [master.js, 'js/home.js'],
        source: {
            html: './src/home.html',
            js: './src/js/templates/home.js'
        },
        inject: false,
        dist: './home.html',
    },
    {
        url: /^\/teste/,
        file: '/teste.html',
        title: 'teste',
        css: [master.css, 'css/teste.css'],
        js: [master.js, 'js/teste.js'],
        source: {
            html: './src/teste.html',
            js: './src/js/templates/teste.js'
        },
        inject: false,
        dist: './teste.html',
    }
]

function routeGenerator(data) {
    var arr = [];

    data.forEach(
        function(page) {
            return arr.push({ 'from': page.url, 'to': page.file })
        }
    )

    return arr
}

function pageGenerator(data) {
    var arr = [
        new MiniCssExtractPlugin({  
            filename: "css/[name].css"  
        }),
    ];

    data.forEach(
        function(page) {
            return arr.push(
                new HtmlWebpackPlugin({
                    title: page.title,
                    css: page.css,
                    js: page.js,
                    template: page.source.html,
                    inject: false,
                    filename: page.dist,
                })
            )
        }
    )

    return arr
}

function getFiles(paths) {
    var ret = {
        main: './src/js/index.js',
    }

    paths.forEach(
        function(path) {
            var fileName = path.split('/').slice(-1)[0].split('.js')[0];
            ret[fileName] = path;
        }
    );

    return ret;
}

var routes = routeGenerator(pages)
var pages = pageGenerator(pages)

module.exports = {

    devServer: {
        historyApiFallback: {
            rewrites: routes
            //   rewrites: [

            //     { from: /^\/$/, to: '/home.html' },
            //     { from: /^\/teste/, to: '/teste.html' },
            //     { from: /./, to: '/views/404.html' }
            //   ]
        }
    },

    // entry: './src/js/index.js',

    // entry: {
    //     main: './src/js/index.js',
    //     teste: './src/js/templates/teste.js',
    //     home: './src/js/templates/home.js'
    // },

    entry: getFiles(glob.sync(__dirname + '/src/js/templates/*.js')),

    output: {  
        path: path.resolve('dist'),  
        filename: 'js/[name].js'
    },
    
    module: {  
        rules: [
            {  
                test: /\.js$/,
                exclude: /node_modules/,  
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                    }
                }  
            },
            {      
                test: /\.scss$/,  
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }
            }
        ]  
    },

    plugins: pages

    // plugins: [
    //     // new webpack.ProvidePlugin({
    //     //     cowsay: "cowsay-browser"
    //     // }),

    //     new MiniCssExtractPlugin({  
    //         filename: "css/[name].css"  
    //     }),

    //     new HtmlWebpackPlugin({
    //         title: 'Home',
    //         css: ['css/main.css', 'css/home.css'],
    //         js: ['js/main.js', 'js/home.js'],
    //         template: './src/home.html',
    //         inject: false,
    //         filename: './home.html',
    //     }),

    //     new HtmlWebpackPlugin({
    //         title: 'Teste',
    //         css: ['css/main.css', 'css/teste.css'],
    //         js: ['js/main.js', 'js/teste.js'],
    //         template: './src/teste.html',
    //         inject: false,
    //         filename: './teste.html',
    //     }),
    // ]
}