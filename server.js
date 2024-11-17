// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// GitHub release URLs
const GITHUB_CRX_URL = 'https://github.com/subham8907/Linkumori/releases/latest/download/Linkumori.crx';
const GITHUB_UPDATE_URL = 'https://github.com/subham8907/Linkumori/releases/latest/download/updates.xml';

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
                .warning { 
                    background: #fff3cd; 
                    border: 1px solid #ffeeba; 
                    padding: 1em; 
                    border-radius: 5px; 
                    margin: 1em 0;
                }
                code { 
                    background: #e9ecef; 
                    padding: 0.2em 0.4em; 
                    border-radius: 3px; 
                    display: block;
                    white-space: pre-wrap;
                    margin: 0.5em 0;
                }
            </style>
        </head>
        <body>
            <h1>Linkumori Extension</h1>
            
            <div class="warning">
                <h3>⚠️ Important: Enable Extension Installation</h3>
                <p>First, run these commands in PowerShell as Administrator:</p>
                <p><strong>For Chrome:</strong></p>
                <code>New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome" -Name ExtensionInstallSources -Force
New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\ExtensionInstallSources" -Name "1" -Value "http://localhost:3000/*" -Force</code>
                
                <p><strong>For Edge:</strong></p>
                <code>New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge" -Name ExtensionInstallSources -Force
New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge\\ExtensionInstallSources" -Name "1" -Value "http://localhost:3000/*" -Force</code>
            </div>

            <div class="info">
                <h2>Installation Steps:</h2>
                <ol>
                    <li>Run the above commands (requires admin rights)</li>
                    <li>Restart your browser</li>
                    <li>Click the download button below</li>
                    <li>Go to chrome://extensions or edge://extensions</li>
                    <li>Enable Developer Mode (toggle in top right)</li>
                    <li>Drag and drop the downloaded .crx file into the extensions page</li>
                </ol>
            </div>

            <a href="/extension.crx" class="button">Download Extension</a>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('\nRun these commands in PowerShell as Administrator to enable installation:');
    
    console.log('\nFor Chrome:');
    console.log('New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome" -Name ExtensionInstallSources -Force');
    console.log('New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\ExtensionInstallSources" -Name "1" -Value "http://localhost:3000/*" -Force');
    
    console.log('\nFor Edge:');
    console.log('New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge" -Name ExtensionInstallSources -Force');
    console.log('New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge\\ExtensionInstallSources" -Name "1" -Value "http://localhost:3000/*" -Force');
});
