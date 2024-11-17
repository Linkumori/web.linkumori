const express = require('express');
const axios = require('axios');

const app = express();
// Use process.env.PORT for hosting platforms that set their own port
const PORT = process.env.PORT || 8000;

// GitHub release URLs
const GITHUB_CRX_URL = 'https://github.com/subham8907/Linkumori/releases/download/B45/Linkumori.crx';
const GITHUB_UPDATE_URL = 'https://github.com/subham8907/Linkumori/releases/download/B45/updates.xml';

// Proxy the extension file with correct MIME type
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

// Serve the landing page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Linkumori Extension Download</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 2em auto; 
                    padding: 0 1em; 
                    line-height: 1.6;
                }
                .button { 
                    display: inline-block; 
                    padding: 10px 20px; 
                    background: #4CAF50; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 1em 0;
                }
                .info { 
                    background: #f0f0f0; 
                    padding: 1em; 
                    border-radius: 5px; 
                    margin: 1em 0;
                }
            </style>
        </head>
        <body>
            <h1>Linkumori Extension</h1>
            
            <div class="info">
                <h2>Installation Steps:</h2>
                <ol>
                    <li>Click the download button below to get the extension</li>
                    <li>Go to chrome://extensions or edge://extensions in your browser</li>
                    <li>Enable Developer Mode (toggle in top right)</li>
                    <li>Drag and drop the downloaded .crx file into the extensions page</li>
                </ol>
            </div>

            <a href="/extension.crx" class="button">Download Extension</a>
            
            <div class="info">
                <p>Note: If you encounter any installation issues, you can also install the extension manually:</p>
                <ol>
                    <li>Download the extension</li>
                    <li>Rename the .crx file to .zip</li>
                    <li>Extract the zip file to a folder</li>
                    <li>In your browser's extension page, click "Load unpacked"</li>
                    <li>Select the extracted folder</li>
                </ol>
            </div>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
