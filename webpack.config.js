const path = require('path')
// const webpack = require('webpack')
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
        title: 'Home',
        css: [master.css, 'css/home.css'],
        js: [master.js, 'js/home.js'],
        source: './src/home.html',
        inject: false,
        dist: './home.html',
    },
    {
        url: /^\/teste/,
        file: '/teste.html',
        title: 'Teste',
        css: [master.css, 'css/teste.css'],
        js: [master.js, 'js/teste.js'],
        source: './src/teste.html',
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
                    template: page.source,
                    inject: false,
                    filename: page.dist,
                })
            )
        }
    )

    return arr
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

    entry: {
        main: './src/js/index.js',
        teste: './src/js/templates/teste.js',
        home: './src/js/templates/home.js'

        // main: buildEntryPoint('./src/js/templates/index.js'),
        // teste: buildEntryPoint('./src/js/templates/teste.js'),
        // home: buildEntryPoint('./src/js/templates/home.js')
    },

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