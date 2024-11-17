const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 6500;

// GitHub release URLs
const GITHUB_CRX_URL = 'https://github.com/subham8907/Linkumori/releases/download/B45/Linkumori.crx';
const GITHUB_UPDATE_URL = 'https://github.com/subham8907/Linkumori/releases/download/B45/updates.xml';

// Serve static files
app.use(express.static(path.join(__dirname)));

// Proxy the extension file
app.get('/extension.crx', async (req, res) => {
    try {
        const response = await axios({
            url: GITHUB_CRX_URL,
            method: 'GET',
            responseType: 'stream'
        });
        res.set('Content-Type', 'application/x-chrome-extension');
        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching extension:', error);
        res.status(500).send('Error fetching extension');
    }
});

// Proxy the update manifest
app.get('/updates.xml', async (req, res) => {
    try {
        const response = await axios({
            url: GITHUB_UPDATE_URL,
            method: 'GET',
            responseType: 'stream'
        });
        res.set('Content-Type', 'application/xml');
        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching update manifest:', error);
        res.status(500).send('Error fetching update manifest');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});