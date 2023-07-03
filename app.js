const fs = require('node:fs');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 8090;

let robotsTxt = '';

try {
    robotsTxt = fs.readFileSync('./robots.txt', 'utf8');

    app.get('/proxy', (req, res) => {
        const url = req.query.link; // 例: https://www.baidu.com

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
