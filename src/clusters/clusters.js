const cluster = require('cluster');
const os = require('os');

const numCPUs = os.cpus().length;

const startCluster = (startWorker) => {
    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

        // Fork workers (one per CPU core)
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died. Restarting...`);
            cluster.fork();
        });
    } else {
        startWorker(); // Calls Express app for each worker
    }
};

module.exports = startCluster;
