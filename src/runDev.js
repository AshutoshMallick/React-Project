const { createProxyMiddleware } = require("http-proxy-middleware");
const Bundler = require("parcel-bundler");
const express = require("express");

const bundler = new Bundler("src/index.html", {
  cache: false,
});

const app = express();

const PORT = process.env.PORT || 8000;

app.use(
  "/api",
  createProxyMiddleware({
    target: "http://0.0.0.0:8001",
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      "^/api": "",
    },
  })
);

app.use(bundler.middleware());

app.listen(PORT);
