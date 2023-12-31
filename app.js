const fs = require('node:fs');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 8090;

let robotsTxt = '';

try {
    robotsTxt = fs.readFileSync('./robots.txt', 'utf8');

    app.get('/proxy', (req, res) => {
        const ipArray = req.socket.remoteAddress.split('.');
        const endIP = parseInt(ipArray[ipArray.length - 1]);
        const url = req.query.link; // 例: https://www.baidu.com

        // 仅允许23.98.142.176/28网段访问。
        if (!(ipArray.slice(0, 3).join('.') === '23.98.142' && endIP >= 176 && endIP <= 191)) {
            res.status(403).send('403 Forbidden');
            return;
        }

        if (url.endsWith('robots.txt')) {
            res.set('Content-Type', 'text/plain');
            res.send(robotsTxt);
            return;
        }

        axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
            }
        }).then((response) => {
            res.send(response.data);
        }).catch((error) => {
            console.error(error);
            res.status(500).send('Something broke!');
        });
    });

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
} catch (error) {
    console.log('读取文件失败。');
}
