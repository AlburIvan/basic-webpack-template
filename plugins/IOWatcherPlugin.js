const chokidar = require('chokidar');

class IOWatcherPlugin {

    constructor(path = '', options = {}) {
        this.pluginName = 'IOWatcherPlugin'
        this.path = path;
        this.options = options;
    }


    // https://webpack.js.org/contribute/plugin-patterns/
    // TODO: check https://github.com/webpack/webpack/issues/5407 might have an answer to my problem

    // read at: https://github.com/webpack-contrib/copy-webpack-plugin/blob/master/src/index.js
    // read at: https://github.com/webpack/webpack-dev-server/issues/1354
    apply(compiler) {

        let fileDependencies = []
        let addFileDependency = void 0;

        // compiler.compilation.tap(this.pluginName, ())

        compiler.hooks.afterCompile.tap(this.pluginName, (compilation) => {
            console.log('Starting [afterCompile] hook');
        })

        compiler.hooks.afterEmit.tap(this.pluginName, (compilation) => {
            console.log('Starting [afterEmit] hook');

            let compilationFileDependencies = void 0;
            // console.log(compilation.fileDependencies)

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

        });

        // see: 
        // https://github.com/webpack/webpack-dev-server/issues/34
        compiler.hooks.done.tap(this.pluginName, (compilation) => {

            console.log('Starting [done] hook')

            let watcher = chokidar.watch(this.path, {});

            watcher
                .on('add', (path) => {

                    console.log(this.pluginName, 'File added: ', path);

                    let fileIsTracked = fileDependencies.includes(path);

                    if (fileIsTracked) {
                        console.log(`not adding ${path} to change tracking, because it's already tracked`);
                    } else {
                        console.log(`adding ${path} to change tracking`);
                        addFileDependency(path);
                    }
                    // filter those that are already added ?

                    // compiler.run((err) => {
                    //     if (err) throw err;

                    //     console.log(this.pluginName, 'File added: ', path);
                    //     watcher.close();
                    // });
                })
                .on('unlink', (path) => {

                    console.log(this.pluginName, `File ${path} has been removed`);

                    // compiler.run((err) => {
                    //     if (err) throw err;

                    //     watcher.close();
                    // });
                })
        })

    }

}

module.exports = IOWatcherPlugin;