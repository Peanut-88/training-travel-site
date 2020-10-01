// package de la librairie node
// permet peut importe le system d'exploitation (windows mac ou linux)
// de générer le chemin absolue du bon dossier
const path = require('path') 

const postCSSPlugin = [
    require('postcss-import'),
    require('postcss-mixins'),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    require('autoprefixer')
]

module.exports = { // on export l'objet qui doit être utilisé par webpack
    // point d'entrée de notre application
    // fichier que webpack doit surveiller traiter et "bundle"
    entry: './app/assets/scripts/App.js',
    output: {
        // on nomme le "bundle file"
        filename: 'bundle.js',
        // où se situe le fichier
        path: path.resolve(__dirname, 'app')
    },
    devServer: {
        before: function(app, server) {
            server._watch('./**/*.html') // ** : n'importe quel sous dossier, *.html: nimporte quel fichier finissant par html
        },
        contentBase: path.join(__dirname, 'app'),// dossier du server: ici app car dans contient index.html
        hot: true, // permet injection CSS et HTML sans refresh
        port: 3000,
        host: '0.0.0.0' // permet au appareil sur le meme réseau d'acceder au server webpack
    },
    // mode developement car on est pas prêt de livrer fichier
    // où de les placer sur serveur d'hebergement
    mode: 'development',
    // warch : surveiller les modifications des fichiers sources (ou entry file)
    // et relancer le "bundle"
    // watch: true, // plus besoin du watch car devServer s'en charge
    // Faire en sorte que Webpack supporte le CSS 
    module: {
        rules: [
            {
                // on ne s'intersse (test) qu'aux fichier se terminant pas /css
                test: /\.css$/i,
                // on va dire ce qu'on fait de ces fichiers
                // en utilisant les packages npm installés
                // on utilise le css-loader : pour que webpack comprenne et bundle le css
                // et style-loader : pour appliquer ce CSS au navigateur
                // dernier parametre : permet d'utiliser post-css
                //      option = option que l'on souhaite utiliser
                use: ['style-loader', 'css-loader?url=false', 
                    {loader: 'postcss-loader', options: {plugins: postCSSPlugin }}]
            }
        ]
    }
}