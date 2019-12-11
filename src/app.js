const path = require('path');
const express = require('express');
const app = express();

const host = 'localhost';
const port = process.env.PORT || 3001;
let counter = 0;

app.use(express.static(path.resolve('./src/public')));

const server = app.listen(port, () => {
    console.info(`listening http://${host}:${port}`, server.address());
});

app.get('/api/counter', (req, res) => {
    console.info(`handling COUNTER request ${new Date().toString()}`);
    counter++;
    res.send({ counter });
})

app.get('/api/users', (req, res) => {
    console.info(`handling USERS request ${new Date().toString()}`);
    const users = [
        { name: 'Ann', email: 'ann@mail' },
        { name: 'Bill', email: 'bill@mail' },
        { name: 'Lee', email: 'lee@mail' },
    ];
    res.setHeader('Access-Control-Expose-Headers', 'my-custom-header');
    res.setHeader('my-custom-header', '123');
    res.send(users);
})
