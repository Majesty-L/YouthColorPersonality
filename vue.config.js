const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://localhost:8099',
        // target: 'http://1.12.57.147:8099',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        ws: false,
      }
    }
  }
})