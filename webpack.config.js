const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './client/index.js',
        feed: './client/feed.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: '[name].bundle.js',
    },
    mode: process.env.NODE_ENV,
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './client/index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            filename: 'feed.html', // Output file
            template:'./client/feed.html',
            chunks: ['feed']
        })
    ],
    devServer: {
        port: 8080,
        hot: true,
        static: {
            directory: path.resolve(__dirname, 'build'),
            publicPath: '/'
        },
        proxy: {
            '/signup': 'http://localhost:3000',
            '/login': 'http://localhost:3000',
            '/client': 'http://localhost:3000',
            // '/feed': 'http://localhost:3000',
        },
    },
    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                },
            },
            {
                test: /.(css|scss)$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    }
}
