const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const PORT = 8010;

app.use(bodyParser.json());

app.use('/api',);

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});