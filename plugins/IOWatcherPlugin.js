class IOWatcherPlugin {

  constructor() {
    this.pluginName = 'IOWatcherPlugin'
    this.startTime = Date.now();
    this.prevTimestamps = {};
  }


  // https://webpack.js.org/contribute/plugin-patterns/
  // TODO: check https://github.com/webpack/webpack/issues/5407 might have an answer to my problem
  apply(compiler) {

    compiler.hooks.afterEmit.tapAsync(this.pluginName, (compilation, done) => {
      console.log(this.pluginName, 'Starting hook...')
      let compilationFileDependencies;
      let addFileDependency;

      if (Array.isArray(compilation.fileDependencies)) {
          compilationFileDependencies = new Set(compilation.fileDependencies);
          addFileDependency = (file) => compilation.fileDependencies.push(file);
      } else {
          compilationFileDependencies = compilation.fileDependencies;
          addFileDependency = (file) => compilation.fileDependencies.add(file);
      }

      // Add file dependencies if they're not already tracked
      for (const file of compilationFileDependencies) {
          if (compilationFileDependencies.has(file)) {
              console.log(`not adding ${file} to change tracking, because it's already tracked`);
          } else {
              console.log(`adding ${file} to change tracking`);
              addFileDependency(file);
          }
      }
      done();
    });

    // compiler.hooks.emit.tap(this.pluginName, (compilation) => {

    //   console.log('IOWatcherPlugin:', Object.keys(compilation.fileTimestamps))


    //   let changedFiles = Object.keys(compilation.fileTimestamps)
    //   .filter(watchfile => {
    //     console.log(watchfile)
    //       return (
    //         (this.prevTimestamps[watchfile] || this.startTime) <
    //         (compilation.fileTimestamps[watchfile] || Infinity)
    //       );
    //     }
    //   );

    //   console.log('IOWatcherPlugin watched files: ', changedFiles)

    //   this.prevTimestamps = compilation.fileTimestamps;
    // });

  }

}

module.exports = IOWatcherPlugin;