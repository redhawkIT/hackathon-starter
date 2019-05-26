const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
// MUST BE DEFINED IN CLOSURE SCOPE!
const isDev = process.env.NODE_ENV !== 'production';

/*
CLUSTERING - initializes clustering, then runs the app as a callback.
*/
console.log(`[Clustering]: Initializing clustering, leveraging ${numCPUs} CPUs`)
module.exports = (callback) => {
  // Multi-process to utilize all CPU cores.
  if (!isDev && cluster.isMaster) {
    console.error(`[${process.pid} - Clustering]: master is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      console.error(`[${worker.process.pid} - Clustering]: worker exited: code ${code}, signal ${signal}`);
    });

  } else {
    callback()
  }
}