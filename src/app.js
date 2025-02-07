const cluster = require('cluster');
const os = require('os');
const { Worker } = require('worker_threads');

const numCPUs = os.cpus().length;

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
    const runWorker = (workerData) => {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./worker.js', { workerData });

            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
            });
        });
    };

    const workerData = {
        url: 'https://example.com',
        method: 'GET',
        headers: {},
        body: null,
        requests: 100, // Total requests per worker thread
        concurrency: 10, // Concurrent requests per worker thread
    };

    // Run multiple worker threads inside each cluster process
    const numWorkers = 4; // Adjust as needed
    const workerPromises = [];

    for (let i = 0; i < numWorkers; i++) {
        workerPromises.push(runWorker(workerData));
    }

    Promise.all(workerPromises)
        .then((results) => {
            console.log(`Worker ${process.pid} completed:`, results);
        })
        .catch((err) => console.error(`Worker ${process.pid} error:`, err));
}
