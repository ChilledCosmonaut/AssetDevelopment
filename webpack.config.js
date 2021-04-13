module.exports = {
    entry: {
      app: './src/app.js'
    },
    output: {
      path: __dirname + '/dist',
      filename: '[name].js'
    },
    mode: "development"
  }