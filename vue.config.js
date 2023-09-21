
const nodeExternals = require('webpack-node-externals');

module.exports = {
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      config.externals =  [ nodeExternals({allowlist: [/^element-ui/]}) ];
    }
  },
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('shader')
      .test(/\.(vs|fs)$/i)
      .use('raw-loader')
        .loader('raw-loader')
        .end()
    const fontsRule = config.module.rule('fonts')
    fontsRule.uses.clear()
    config.module
      .rule('fonts')
      .test(/\.(ttf|otf|eot|woff|woff2)$/)
      .use('base64-inline-loader')
      .loader('base64-inline-loader')
      .tap(options => {
        // modify the options...    
        return options
      })
      .end()
  },
  css: {
    sourceMap: process.env.NODE_ENV === 'wc',
    extract: process.env.NODE_ENV !== 'wc',
    //Import variables into all stylesheets.
    loaderOptions: {
      sass: {
        prependData: `@import '@/assets/styles';`
      }
    }
  }
}
