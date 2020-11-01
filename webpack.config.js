const currentTask = process.env.npm_lifecycle_event

// package de la librairie node
// permet peut importe le system d'exploitation (windows mac ou linux)
// de générer le chemin absolue du bon dossier
const path = require('path') 

// import du plugin npm webpack pour gérer la suppression
const {CleanWebpackPlugin } = require ('clean-webpack-plugin')

// permet d'extraire fichier CSS du bundle.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

//  
const HtmlWebpackPlugin = require('html-webpack-plugin')

const fse = require('fs-extra')

const postCSSPlugin = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('postcss-hexrgba'),
    require('autoprefixer')
]

// afin de copier les images
class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap('Copy images', function() {
            fse.copySync('./app/assets/images', './docs/assets/images')
        })
    }
}

let cssConfig = {
    test: /\.css$/i,
    use: ['css-loader?url=false', {loader: 'postcss-loader', options: {plugins: postCSSPlugin }}]
}

// on veut récupérer un array contenant tous les fichiers html
let pages = fse.readdirSync('./app').filter(function(file) {
    return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin({
        filename: page,
        template: `./app/${page}`
    })
})

let config = {
    entry: './app/assets/scripts/App.js',
    /*plugins: [new HtmlWebpackPlugin({filename: 'index.html', template: './app/index.html'})],*/
    plugins: pages,
    module: {
        rules: [
            cssConfig
        ]
    }
}

if (currentTask == "dev") {
    // unshift pour ajouter element debut array
    cssConfig.use.unshift('style-loader')

    config.output = {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'app')
    }
    config.devServer = {
        before: function(app, server) {
            server._watch('./**/*.html') 
        },
        contentBase: path.join(__dirname, 'app'),
        hot: true, 
        port: 3000,
        host: '0.0.0.0' 
    }
    config.mode = 'development'
} 

if (currentTask == "build") {
    config.module.rules.push({
        /* on indique les règles qu'on veut appliquer pour les fichiers js*/
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
    })

    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    postCSSPlugin.push(require('cssnano'))
    
    config.output = {
        /* Pour créer noveau fichier avec nouveau nom en cas de modification  */
        /*filename: 'bundle.js',*/
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'docs')
    }
    config.mode = 'production'
    
    /* permet de créer fichier vendor */
    config.optimization = {
        splitChunks: {chunks: 'all'}
    }
    /* Import de différent plugin,
    ici un  cleanwebpackplugin pour gérer suppression
    lors de la génération fichiers */
    config.plugins.push(
        new CleanWebpackPlugin(), 
        new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
        new RunAfterCompile())
} 


module.exports = config