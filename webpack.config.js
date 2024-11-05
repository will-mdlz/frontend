module.exports = {
    resolve: {
      fallback: {
        "zlib": false,
      },
    },

    ignoreWarnings: [
      {
        module: /node_modules\/node-irr/, // Ignore warnings from node-irr module
      },
    ],
  };