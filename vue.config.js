const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8082,
    proxy: {
      '/api/': {
        target: 'http://localhost:8090',
        // target: 'http://175.27.167.171:8090',
        // target: 'http://120.79.43.216:8088',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        ws: false,
      },
    }
  }
})