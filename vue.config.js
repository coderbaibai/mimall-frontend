module.exports = {
  devServer:{
    host:'0.0.0.0',
    port:8080,
    proxy:{
      '/api':{
        target:'http://127.0.0.1:8081',
        // target:'10.236.158.11:8081',
        changeOrigin:true,
        pathRewrite:{
          '/api':''
        }
      }
    }
  },
  // publicPath:'/app',
  // outputDir:'dist',
  // indexPath:'index2.html',
  // lintOnSave:false,
  productionSourceMap:true,
  chainWebpack:(config)=>{
    config.plugins.delete('prefetch');
  }
}