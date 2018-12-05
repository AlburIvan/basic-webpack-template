class IOWatcherPlugin {

    constructor() {
        this.pluginName = 'IOWatcherPlugin'
        this.startTime = Date.now();
        this.prevTimestamps = {};
    }


    // https://webpack.js.org/contribute/plugin-patterns/
    // TODO: check https://github.com/webpack/webpack/issues/5407 might have an answer to my problem

    // read at: https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/src/index.js
    // read at: https://github.com/webpack/webpack-dev-server/issues/1354
    apply(compiler) {

        compiler.hooks.watchRun.tapAsync(this.pluginName, (compilation, callback) => {
            console.log(this.pluginName, 'Starting hook...')
            let compilationFileDependencies;
            let addFileDependency;

            const { watchFileSystem } = compiler;
            const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;

            //   return Object.keys(watcher.mtimes);

            console.log('watcher', watcher)
            console.log(this.pluginName, Object.keys(watcher.fileWatchers))

            //   if (Array.isArray(compilation.fileDependencies)) {
            //       compilationFileDependencies = new Set(compilation.fileDependencies);
            //       addFileDependency = (file) => compilation.fileDependencies.push(file);
            //   } else {
            //       compilationFileDependencies = compilation.fileDependencies;
            //       addFileDependency = (file) => compilation.fileDependencies.add(f   ile);
            //   }

            //   // Add file dependencies if they're not already tracked
            //   for (const file of compilationFileDependencies) {
            //       if (compilationFileDependencies.has(file)) {
            //           console.log(`not adding ${file} to change tracking, because it's already tracked`);
            //       } else {
            //           console.log(`adding ${file} to change tracking`);
            //           addFileDependency(file);
            //       }
            //   }
            callback();
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