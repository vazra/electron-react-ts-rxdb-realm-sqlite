module.exports = {
  module: {
    rules: [],
  },
  resolve: {
    alias: {
      // this is to fix react warning while using hot-loader
      "react-dom": "@hot-loader/react-dom",
    },
  },
};
