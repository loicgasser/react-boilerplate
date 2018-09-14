const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV == 'test') {
    require('dotenv').config({ path: '.env.test' })
} else if (process.env.NODE_ENV == 'development') {
    require('dotenv').config({ path: '.env.development' })
}

module.exports = (env) => {
    const isProduction = env == 'production'

    return {
        mode: 'development',
        entry: ['babel-polyfill', './src/app.js'],
        watch: isProduction ? false : true,
        watchOptions: {
            poll: true,
            ignored: /node_modules/
        },
        output: {
            path: path.join(__dirname, 'public', 'dist'),
            filename: 'bundle.js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    test: /\.js$/
                },
                {
                    test: /\.s?css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'styles.css',
                chunkFilename: 'styles.[hash].css'
            }),
            new HtmlWebpackPlugin({
                template: 'public/index.template.html',
                minify: true
            }),
            new CopyWebpackPlugin([
                { from: 'public/images',to: 'images' }
            ])
        ],
        devtool: isProduction ? false : 'cheap-module-eval-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public', 'dist'),
            compress: false,
            port: 9000,
            historyApiFallback: true
        }
    }
}