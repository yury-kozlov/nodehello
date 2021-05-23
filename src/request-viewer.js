const path = require('path');
const express = require('express');

const app = express();
const host = 'localhost';
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.resolve('./src/public')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const server = app.listen(port, '0.0.0.0', () => {
    console.info(`listening http://${host}:${port}`, server.address());
});

const router = express.Router();
app.use('/api', router);
router.get('/users', async (req, res) => {
    console.info(`handling USERS request ${new Date().toString()}`);
    const users = [
        { name: 'Ann', email: 'ann@mail' },
        { name: 'Bill', email: 'bill@mail' },
        { name: 'Lee', email: 'lee@mail' },
    ];
    res.setHeader('Access-Control-Expose-Headers', 'my-custom-header');
    res.setHeader('my-custom-header', '123');
    res.send(users);
});

app.use('/ready', (req, res) => {
    res.send('ok');
})

app.use('/env', (req, res) => {
    const url = `${host}:${port}${req.url}`;
    var result = {
        url,
        timestamp: new Date().toISOString(),
        requestHeaders: req.headers,
        env: process.env,
    };
    res.send(result);
})

app.use('/', async (req, res) => {
    const url = `${host}:${port}${req.url}`;
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} ${url}`);
    res.send({ url, timestamp, headers: req.headers });
})