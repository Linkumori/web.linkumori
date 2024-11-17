// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4001;
const DOMAIN = process.env.DOMAIN || 'localhost';

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
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Linkumori Extension Download</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\ExtensionInstallSources" -Name "1" -Value "${baseUrl}/*" -Force</code>
                
                <p><strong>For Edge:</strong></p>
                <code>New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge" -Name ExtensionInstallSources -Force
New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge\\ExtensionInstallSources" -Name "1" -Value "${baseUrl}/*" -Force</code>
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

            <script>
                // Add automatic copy functionality for commands
                document.querySelectorAll('code').forEach(block => {
                    block.style.cursor = 'pointer';
                    block.title = 'Click to copy';
                    block.onclick = function() {
                        navigator.clipboard.writeText(this.textContent.trim())
                            .then(() => {
                                const originalBg = this.style.background;
                                this.style.background = '#90EE90';
                                setTimeout(() => {
                                    this.style.background = originalBg;
                                }, 200);
                            });
                    };
                });
            </script>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://${DOMAIN}:${PORT}`);
    console.log('\nRun these commands in PowerShell as Administrator to enable installation:');
    
    const baseUrl = `http://${DOMAIN}:${PORT}`;
    
    console.log('\nFor Chrome:');
    console.log('New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome" -Name ExtensionInstallSources -Force');
    console.log(`New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\ExtensionInstallSources" -Name "1" -Value "${baseUrl}/*" -Force`);
    
    console.log('\nFor Edge:');
    console.log('New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge" -Name ExtensionInstallSources -Force');
    console.log(`New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge\\ExtensionInstallSources" -Name "1" -Value "${baseUrl}/*" -Force`);
});
