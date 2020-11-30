const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    createProxyMiddleware("/pd/", {
      target: "http://chinavis2020.cvnis.net:8000/",
      changeOrigin: true,
      pathRewrite: {
        '^/pd/': ''
      },
    })
  );
};