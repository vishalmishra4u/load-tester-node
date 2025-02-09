const express = require('express');
const startCluster = require('./clusters/clusters');
const loadTestRoutes = require('./routes/routers');

const app = express();
app.use(express.json());

// Load test routes
app.use('/load-test', loadTestRoutes);

const PORT = process.env.PORT || 3000;
startCluster(() => {
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} listening on port ${PORT}`);
    });
});
