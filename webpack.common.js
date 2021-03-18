const path = require('path');

module.exports = {
  entry: {
    app: './src/Timer.js',
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
  output: {
    filename: 'danehansen-Timer.min.js',
    library: ['danehansen', 'Timer'],
    libraryTarget: 'umd',
    path: __dirname,
  },
  externals: [
    {
      '@danehansen/event-dispatcher': {
        amd: '@danehansen/event-dispatcher',
        commonjs: '@danehansen/event-dispatcher',
        commonjs2: '@danehansen/event-dispatcher',
        root: ['danehansen', 'EventDispatcher'],
      },
    },
  ],
}
