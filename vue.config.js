module.exports = {
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "@/styles/base/_all";',
      },
    },
  },
};
