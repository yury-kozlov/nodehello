const path = require('path');
const express = require('express');
const axios = require('axios').default;
const app = express();

const host = 'localhost';
const port = process.env.PORT || 3001;

app.use(express.static(path.resolve('./src/public')));

const server = app.listen(port, () => {
    console.info(`listening http://${host}:${port}`, server.address());
});

app.use('/', async (req, res) => {
    try {
        const url = `${host}:${port}${req.url}`;
        var proxyUrl = `http://192.168.56.100:30999${req.path}`;

        console.log(`${new Date().toISOString()} ${url}  ->  ${proxyUrl}`);

        var options = { headers: req.headers, validateStatus: (status) => status < 500 };
        if (req.url.includes('png') || req.url.includes('jpg')) {
            options.responseType = 'arraybuffer';
        }
        const response = await axios.get(proxyUrl, options);
        const { status, statusText, data, headers: h } = response;
        res.status(status);
        for (const key in response.headers) {
            if (response.headers.hasOwnProperty(key)) {
                const value = response.headers[key];
                if (key == 'content-type' && value.startsWith('text/html')) {
                    res.setHeader('Cache-Control', 'public, max-age=31557600'); // one year
                    res.setHeader('Content-Type', 'text/html');
                    continue;
                }
                else if (key == 'pragma') {
                    continue;
                }
                else if (key == 'etag') {
                    continue;
                }
                res.setHeader(key, value);
            }
        }
        const t = typeof data;
        if (t == "string" || t == "Buffer" || t == "ArrayBuffer" || t == "Array") {
            res.send(new Buffer(data)); // new Buffer is used here in order to prevent appending charset-utf to content-type header by express
        } else {
            res.send(data);
        }
    } catch (error) {
        // console.error(error);
        if (error.response) {
            const { status, statusText, data, headers } = error.response;
            const requestHeaders = error.request._headers;
            res.send({ status, statusText, data, headers, requestHeaders, e: error.toString() });
        } else {
            res.send({ e: error.toString() });
        }
    }
})