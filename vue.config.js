module.exports = {
  /* Vue.js assumes that app is usually deployed on a root-level, a workaround. */
  publicPath: process.env.NODE_ENV === 'production' ? `/${process.env.VUE_APP_PUBLIC_PATH}/` : '/',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'NEAR Vue.js Guest Book',
    },
  }
};
