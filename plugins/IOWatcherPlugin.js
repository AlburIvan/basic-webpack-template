class IOWatcherPlugin {

  constructor() {
    this.pluginName = 'IOWatcherPlugin'
    this.startTime = Date.now();
    this.prevTimestamps = {};
  }


  // https://webpack.js.org/contribute/plugin-patterns/
  // TODO: check https://github.com/webpack/webpack/issues/5407 might have an answer to my problem
  apply(compiler) {
    compiler.hooks.beforeCompile.tap(this.pluginName, (compilation) => {

      // compilation.hooks.beforeCompile.tap(this.pluginName, () => {

        // console.log('IOWatcherPlugin beforeCompile: ', compilation)

        let changedFiles = Object.keys(compilation.fileTimestamps)
          .filter(watchfile => {
            console.log('IOWatcherPlugin file: ', watchfile)
  
            return (
              (this.prevTimestamps[watchfile] || this.startTime) <
              (compilation.fileTimestamps[watchfile] || Infinity)
            );
          })
  
        // Insert this list into the webpack build as a new file asset:
        // compilation.assets['filelist.md'] = {
        //   source: function() {
        //     return false;
        //   },
        //   size: function() {
        //     return filelist.length;
        //   }
        // };
  
        console.log('IOWatcherPlugin watched files: ', changedFiles)
      // this.prevTimestamps = compilation.fileTimestamps;
    });
  } 

}

module.exports = IOWatcherPlugin;