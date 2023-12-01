const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://localhost:8088',
        // target: 'http://1.12.57.147:8099',
        // target: 'http://120.79.43.216:8088',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        ws: false,
      }
    }
  }
})