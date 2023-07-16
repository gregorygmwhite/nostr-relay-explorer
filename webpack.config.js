const path = require('path');

module.exports = {
    entry: './client.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js',
    },
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 8080,
    },
};
