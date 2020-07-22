var BundleTracker = require("webpack-bundle-tracker");

const pages = {
  vue_file_manager_app: {
    entry: "./src/main.js",
    chunks: ["chunk-vendors"],
  },
};

module.exports = {
  pages: pages,
  filenameHashing: false, // necessary?
  publicPath:
    process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/",
  outputDir: "../api/static/bundle/",
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "chunk-vendors",
          chunks: "all",
          priority: 1,
        },
      },
    });
    Object.keys(pages).forEach((page) => {
      config.plugins.delete(`html-${page}`);
      config.plugins.delete(`preload-${page}`);
      config.plugins.delete(`prefetch-${page}`);
    });
    config
      .plugin("BundleTracker")
      .use(BundleTracker, [{ filename: "../client/webpack-stats.json" }]);
    config.devServer
      .public("http://localhost:8080/")
      .host("localhost")
      .port(8080)
      .hotOnly(true)
      .watchOptions({ poll: 1000 })
      .https(false)
      .headers({ "Access-Control-Allow-Origin": ["*"] });
  },
};
