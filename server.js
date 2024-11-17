// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Create downloads directory if it doesn't exist
const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

// Download the extension files if they don't exist
async function downloadFiles() {
    const files = [
        {
            url: 'https://github.com/subham8907/Linkumori/releases/download/B45/Linkumori.crx',
            filename: 'Linkumori.crx'
        },
        {
            url: 'https://github.com/subham8907/Linkumori/releases/download/B45/updates.xml',
            filename: 'updates.xml'
        }
    ];

    for (const file of files) {
        const filepath = path.join(downloadDir, file.filename);
        if (!fs.existsSync(filepath)) {
            console.log(`Downloading ${file.filename}...`);
            const response = await axios({
                method: 'get',
                url: file.url,
                responseType: 'stream'
            });
            const writer = fs.createWriteStream(filepath);
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }
    }
}

// Serve the extension files with proper MIME types
app.get('/extension.crx', (req, res) => {
    res.set('Content-Type', 'application/x-chrome-extension');
    res.sendFile(path.join(downloadDir, 'Linkumori.crx'));
});

app.get('/updates.xml', (req, res) => {
    res.set('Content-Type', 'application/xml');
    res.sendFile(path.join(downloadDir, 'updates.xml'));
});

// Serve a simple HTML page for downloading the extension
app.get('/', (req, res) => {
    res.send(`
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="favicon.ico" />
    <title>Linkumori</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        .nav-item.active {
            border-bottom-color: #3B82F6;
            color: #1F2937;
        }
        .mobile-nav-item.active {
            background-color: #EFF6FF;
            color: #1F2937;
        }
        .feature-card {
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .persistent-buttons {
            transition: all 0.3s ease-in-out;
        }
        @media (min-width: 1024px) {
            .persistent-buttons {
                flex-direction: column;
                right: 20px;
                bottom: 20px;
            }
        }
    </style>
</head>
<body class="bg-gray-100 flex flex-col min-h-screen">
    <nav class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 100 100" class="h-8 w-8">
                            <circle cx="50" cy="50" r="45" fill="#4299e1"></circle>
                            <path d="M35 50 Q35 35, 50 35 L65 35 Q80 35, 80 50 Q80 65, 65 65 L60 65" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"></path>
                            <path d="M65 50 Q65 65, 50 65 L35 65 Q20 65, 20 50 Q20 35, 35 35 L40 35" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"></path>
                            <polygon points="75,20 78,28 86,31 78,34 75,42 72,34 64,31 72,28" fill="white"></polygon>
                        </svg>
                        <span class="ml-2 text-lg font-bold text-gray-900">Linkumori</span>
                    </div>
                    <div class="hidden lg:ml-6 lg:flex lg:space-x-8">
                        <a href="#home" class="nav-item border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-page="home">Home</a>
                        <a href="#features" class="nav-item border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-page="features">Features</a>
                        <a href="#story" class="nav-item border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-page="story">Story</a>
                        <a href="#tech" class="nav-item border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-page="tech">Tech</a>
                        <a href="#learn" class="nav-item border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-page="learn">Learn More</a>
                        <a href="#dependencies" class="nav-item border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" data-page="dependencies">Dependencies</a>
                    </div>
                </div>
                <div class="flex items-center lg:hidden">
                    <button id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-expanded="false">
                        <span class="sr-only">Open main menu</span>
                        <i data-lucide="menu" class="h-6 w-6" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
        <div id="mobile-menu" class="hidden lg:hidden">
            <div class="px-2 pt-2 pb-3 space-y-1">
                <a href="#home" class="mobile-nav-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-page="home">Home</a>
                <a href="#features" class="mobile-nav-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-page="features">Features</a>
                <a href="#story" class="mobile-nav-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-page="story">Story</a>
                <a href="#tech" class="mobile-nav-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-page="tech">Tech</a>
                <a href="#learn" class="mobile-nav-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-page="learn">Learn More</a>
                <a href="#dependencies" class="mobile-nav-item block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50" data-page="dependencies">Dependencies</a>
            </div>
        </div>
    </nav>

    <main id="main-content" class="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 mb-20 lg:mb-0">
        <!-- Content will be dynamically inserted here -->
    </main>

    <div class="persistent-buttons fixed bottom-0 left-0 right-0 lg:left-auto bg-white shadow-md p-4 flex justify-around items-center lg:w-auto space-x-4 lg:space-x-0 lg:space-y-4">
                   <a href="/extension.crx" 
" class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <i data-lucide="download" class="mr-2 h-4 w-4"></i>
            Install
        </a>
        <a href="https://github.com/subham8907/Linkumori" class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50">
            <i data-lucide="github" class="mr-2 h-4 w-4"></i>
            GitHub
        </a>
    </div>

    <footer class="bg-white mt-auto">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div class="mt-8 md:mt-0 md:order-1">
                <p class="text-center text-base text-gray-400">&copy; 2024 Linkumori. All rights reserved.</p>
                <p class="text-center text-base text-gray-400 mt-2">
                    <a href="#dependencies" class="nav-item text-gray-500 hover:text-gray-700" data-page="dependencies">Legal</a>
                </p>
            </div>
        </div>
    </footer>

    <script>
        // Page content
        const pageContent = {
            home: `
                <div class="bg-white">
                    <div class="relative bg-gray-50 overflow-hidden">
                        <div class="max-w-7xl mx-auto">
                            <div class="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                                <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                    <div class="sm:text-center lg:text-left">
                                        <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                            <span class="block xl:inline">Protect your privacy with</span>
                                            <span class="block text-blue-600 xl:inline">Linkumori</span>
                                        </h1>
                                        <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                            Linkumori is your shield against invasive tracking and data collection. 
                                            Clean your URLs, safeguard your digital footprint, and browse with confidence.
                                        </p>
                                        <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                            <div class="rounded-md shadow">
                                                <a href="https://github.com/subham8907/Linkumori"
                                                   class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                                    <i data-lucide="download" class="mr-2 h-4 w-4"></i> Install Linkumori
                                                </a>
                                            </div>
                                            <div class="mt-3 sm:mt-0 sm:ml-3">
                                                <a href="https://github.com/subham8907/Linkumori"
                                                   class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                                                    <i data-lucide="github" class="mr-2 h-4 w-4"></i> View on GitHub
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </div>
                        <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56 xl:h-64 xl:w-64">
                                <circle cx="50" cy="50" r="45" fill="#4299e1"/>
                                <path d="M35 50 Q35 35, 50 35 L65 35 Q80 35, 80 50 Q80 65, 65 65 L60 65" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/>
                                <path d="M65 50 Q65 65, 50 65 L35 65 Q20 65, 20 50 Q20 35, 35 35 L40 35" fill="none" stroke="white" stroke-width="8" stroke-linecap="round"/>
                                <polygon points="75,20 78,28 86,31 78,34 75,42 72,34 64,31 72,28" fill="white"/>
                            </svg>
                        </div>
                    </div>

                    <!-- Feature section -->
                    <div class="py-12 bg-white">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div class="lg:text-center">
                                <h2 class="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                                <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                    A better way to protect your online privacy
                                </p>
                                <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                                    Linkumori offers cutting-edge technology to ensure your browsing remains private and secure.
                                </p>
                            </div>

                            <div class="mt-10">
                                <dl class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10" id="featureCards">
                                    <!-- Feature cards will be dynamically inserted here -->
                                </dl>
                            </div>
                        </div>
                    </div>

                    <!-- CTA section -->
                    <div class="bg-blue-50">
                        <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                <span class="block">Ready to take control of your privacy?</span>
                                <span class="block text-blue-600">Install Linkumori today.</span>
                            </h2>
                            <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                                <div class="inline-flex rounded-md shadow">
                                    <a href="https://github.com/subham8907/Linkumori"
                                       class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                        Get started
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            features: `
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                        <h2 class="text-xl font-semibold text-gray-900">Key Features</h2>
                    </div>
                    <div class="border-t border-gray-200">
                        <dl id="featureList">
                            <!-- Feature items will be dynamically inserted here -->
                        </dl>
                    </div>
                </div>
          
    </div>
            `,
            story: `
                <div class="px-4 py-6 sm:px-0">
                    <h2 class="text-3xl font-extrabold text-gray-900">The Linkumori Saga</h2>
                    <div class="mt-6 prose prose-blue prose-lg text-gray-500 mx-auto">
                        <p>
                            In the neon-drenched streets of Cyberopolis, where data flows like lifeblood through the veins of the city,
                            a hidden menace lurks. Parasitic code fragments, known as "Trackers," latch onto the URLs of unsuspecting netizens,
                            siphoning their digital essence and leaving a trail of compromised privacy in their wake.
                        </p>
                        <p><p>
                            As the situation grew dire, a reclusive coding prodigy named Yuki Linkumori emerged from the shadows of the deep web.
                            Yuki forged a powerful artifact: The Linkumori Engine. This mystical piece of code, infused with Yuki's genius and
                            passion for digital freedom, had the power to cleanse URLs of their parasitic hitchhikers.
                        </p>
                        <p>
                            Now, every time you activate the Linkumori extension, you become part of this grand narrative. You join the ranks
                            of the URLPurifiers, wielding Yuki's engine to carve out spaces of privacy and freedom in the vast expanse of the internet.
                        </p>
                        <p>
                            Remember: In this vast digital expanse, you are never truly alone. The spirit of Yuki Linkumori lives on in every
                            cleaned URL, in every thwarted tracker. Stay vigilant, Digital Ronin. The battle for the soul of Cyberopolis never ends.
                        </p>
                    </div>
                </div>
            `,
            tech: `
                <div class="px-4 py-6 sm:px-0">
                    <h2 class="text-3xl font-extrabold text-gray-900">Technical Deep Dive</h2>
                    <div class="mt-6 prose prose-blue prose-lg text-gray-500 mx-auto">
                        <h3>Manifest V3 Implementation</h3>
                        <p>
                            Linkumori is built on Manifest V3, leveraging its enhanced security features while overcoming its limitations.
                            This ensures compatibility with the latest browser security standards and provides a foundation for future improvements.
                        </p>
                        <h3>Declarative Net Request</h3>
                        <p>
                            Our extension utilizes Chrome's declarativeNetRequest API, allowing for efficient URL modifications without needing
                            to read the network request data. This approach significantly enhances user privacy and extension performance.
                        </p>
                        <h3>Dynamic URL Cleaning</h3>
                        <p>
                            Linkumori employs sophisticated algorithms to identify and remove tracking parameters from URLs in real-time.
                            This process is optimized to handle a wide variety of URL structures without impacting page load times.
                        </p>
                        <h3>History API Integration</h3>
                        <p>
                            To handle dynamic content and single-page applications, Linkumori integrates with the browser's History API.
                            This allows us to clean URLs even when they change without a full page reload, ensuring comprehensive protection.
                        </p>
                    </div>
                </div>
            `,
            learn: `
                <div class="bg-white">
                    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
                        <div class="max-w-3xl mx-auto text-center">
                            <h2 class="text-3xl font-extrabold text-gray-900">Learn More About Linkumori</h2>
                            <p class="mt-4 text-lg text-gray-500">Discover how Linkumori revolutionizes your online privacy and browsing experience.</p>
                        </div>
                        <dl class="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
                            <div class="relative">
                                <dt>
                                    <svg class="absolute h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p class="ml-9 text-lg leading-6 font-medium text-gray-900">Advanced URL Cleaning</p>
                                </dt>
                                <dd class="mt-2 ml-9 text-base text-gray-500">
                                    Sophisticated algorithms remove tracking parameters in real-time.
                                </dd>
                            </div>
                            <div class="relative">
                                <dt>
                                    <svg class="absolute h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p class="ml-9 text-lg leading-6 font-medium text-gray-900">Privacy-First Design</p>
                                </dt>
                                <dd class="mt-2 ml-9 text-base text-gray-500">
                                    Built with user privacy as the top priority, ensuring your data stays yours.
                                </dd>
                            </div>
                            <div class="relative">
                                <dt>
                                    <svg class="absolute h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p class="ml-9 text-lg leading-6 font-medium text-gray-900">Lightweight & Fast</p>
                                </dt>
                                <dd class="mt-2 ml-9 text-base text-gray-500">
                                    Optimized for performance, Linkumori won't slow down your browsing.
                                </dd>
                            </div>
                            <div class="relative">
                                <dt>
                                    <svg class="absolute h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <p class="ml-9 text-lg leading-6 font-medium text-gray-900">Open Source</p>
                                </dt>
                                <dd class="mt-2 ml-9 text-base text-gray-500">
                                    Transparent and community-driven development for maximum trust and security.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
                 <!-- FAQ Section -->
                    <div class="mt-16">
                <h3 class="text-2xl font-extrabold text-gray-900">Frequently Asked Questions</h3>
                <dl class="mt-6 space-y-6 divide-y divide-gray-200">
                    <div class="pt-6">
                        <dt class="text-lg">
                            <button type="button" class="text-left w-full flex justify-between items-start text-gray-400" aria-controls="faq-0" aria-expanded="false">
                                <span class="font-medium text-gray-900">
                                    Is Linkumori free to use?
                                </span>
                                <span class="ml-6 h-7 flex items-center">
                                    <i data-lucide="chevron-down" class="h-6 w-6"></i>
                                </span>
                            </button>
                        </dt>
                        <dd class="mt-2 pr-12">
                            <p class="text-base text-gray-500">
                                Yes, Linkumori is completely free and open-source. We believe in making privacy protection accessible to everyone.
                            </p>
                        </dd>
                    </div>
                    <div class="pt-6">
                        <dt class="text-lg">
                            <button type="button" class="text-left w-full flex justify-between items-start text-gray-400" aria-controls="faq-1" aria-expanded="false">
                                <span class="font-medium text-gray-900">
                                    Will Linkumori break website functionality?
                                </span>
                                <span class="ml-6 h-7 flex items-center">
                                    <i data-lucide="chevron-down" class="h-6 w-6"></i>
                                </span>
                            </button>
                        </dt>
                        <dd class="mt-2 pr-12">
                            <p class="text-base text-gray-500">
                                Linkumori is designed to remove only non-essential tracking parameters. In most cases, this won't affect website functionality. However, if you encounter any issues, you can easily whitelist specific sites.
                            </p>
                        </dd>
                    </div>
                    <div class="pt-6">
                        <dt class="text-lg">
                            <button type="button" class="text-left w-full flex justify-between items-start text-gray-400" aria-controls="faq-2" aria-expanded="false">
                                <span class="font-medium text-gray-900">
                                    How does Linkumori compare to other privacy extensions?
                                </span>
                                <span class="ml-6 h-7 flex items-center">
                                    <i data-lucide="chevron-down" class="h-6 w-6"></i>
                                </span>
                            </button>
                        </dt>
                        <dd class="mt-2 pr-12">
                            <p class="text-base text-gray-500">
                                While many privacy extensions focus on blocking trackers, Linkumori specializes in cleaning URLs. This approach is less likely to break websites and provides a unique layer of privacy protection that complements other privacy tools.
                            </p>
                        </dd>
                    </div>
                    <div class="pt-6">
                        <dt class="text-lg">
                            <button type="button" class="text-left w-full flex justify-between items-start text-gray-400" aria-controls="faq-3" aria-expanded="false">
                                <span class="font-medium text-gray-900">
                                    Can I contribute to Linkumori's development?
                                </span>
                                <span class="ml-6 h-7 flex items-center">
                                    <i data-lucide="chevron-down" class="h-6 w-6"></i>
                                </span>
                            </button>
                        </dt>
                        <dd class="mt-2 pr-12">
                            <p class="text-base text-gray-500">
                                Absolutely! Linkumori is open-source, and we welcome contributions. Visit our GitHub repository to learn how you can help improve Linkumori.
                            </p>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
            `,
            dependencies: `
                <div class="px-4 py-6 sm:px-0">
                    <h2 class="text-3xl font-extrabold text-gray-900">Dependencies</h2>
                    <div class="mt-6 prose prose-blue prose-lg text-gray-500 mx-auto">
                        <ul>
                            <li>
                                <strong>Tailwind CSS</strong>
                                <ul>
                                    <li>Version: 2.2.19</li>
                                    <li>License: MIT</li>
                                    <li>Source: <a href="https://github.com/tailwindlabs/tailwindcss" target="_blank">https://github.com/tailwindlabs/tailwindcss</a></li>
                                </ul>
                            </li>
                            <li>
                                <strong>Lucide Icons</strong>
                                <ul>
                                    <li>Version: Latest</li>
                                    <li>License: ISC</li>
                                    <li>Source: <a href="https://github.com/lucide-icons/lucide" target="_blank">https://github.com/lucide-icons/lucide</a></li>
                                </ul>
                            </li>
                        </ul>
                        <p>
                            These dependencies are crucial for the styling and iconography of Linkumori. 
                            Tailwind CSS provides a utility-first CSS framework that allows for rapid UI development, 
                            while Lucide Icons offers a comprehensive set of beautifully crafted open-source icons.
                        </p>
                    </div>
                </div>
            `
        };

        // Feature data
        const features = [
            {
                icon: 'code',
                title: 'MV3 Compatibility',
                description: 'Fully compatible with Chrome\'s Manifest V3, ensuring long-term viability and enhanced security for a future-proof browsing experience.'
            },
            {
                icon: 'shield',
                title: 'Declarative Net Request',
                description: 'Utilizes declarativeNetRequest for efficient, privacy-preserving URL modifications without accessing sensitive data.'
            },
            {
                icon: 'history',
                title: 'History API Integration',
                description: 'Employs the replaceState method to clean URLs dynamically, tackling websites that use injected tracking URLs without page reloads.'
            },
            {
                icon: 'lock',
                title: 'User Privacy Protection',
                description: 'Ensures zero data transmission when downloaded directly from GitHub, maintaining complete user privacy and control.'
            },
            {
                icon: 'database',
                title: 'Large Collection of Known Tracking Parameters',
                description: 'Powered by a staggering 800 static rules to identify and remove a wide range of tracking parameters.'
            },
            {
                icon: 'code',
                title: 'Open Source Power',
                description: 'Open-source and constantly evolving, benefiting from community contributions and transparency.'
            }
        ];

        // Function to create feature cards
        function createFeatureCards() {
            const featureCardsContainer = document.getElementById('featureCards');
            if (featureCardsContainer) {
                featureCardsContainer.innerHTML = features.map(feature => `
                    <div class="feature-card relative bg-white p-6 rounded-lg shadow-md">
                        <dt>
                            <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                <i data-lucide="${feature.icon}" class="h-6 w-6"></i>
                            </div>
                            <p class="ml-16 text-lg leading-6 font-medium text-gray-900">${feature.title}</p>
                        </dt>
                        <dd class="mt-2 ml-16 text-base text-gray-500">
                            ${feature.description}
                        </dd>
                    </div>
                `).join('');
                lucide.createIcons();
            }
        }

        // Function to create feature list
        function createFeatureList() {
            const featureList = document.getElementById('featureList');
            if (featureList) {
                featureList.innerHTML = features.map(feature => `
                    <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500 flex items-center">
                            <i data-lucide="${feature.icon}" class="h-5 w-5 mr-2"></i>
                            ${feature.title}
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${feature.description}</dd>
                    </div>
                `).join('');
                lucide.createIcons();
            }
        }

        // Navigation handling
        function setupNavigation() {
            const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
            const mainContent = document.getElementById('main-content');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuButton = document.getElementById('mobile-menu-button');

            function navigateToPage(page) {
                mainContent.innerHTML = pageContent[page];
                updateActiveNavItem(page);
                window.history.pushState({page: page}, '', `#${page}`);
                if (window.innerWidth < 1024) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
                if (page === 'home') {
                    createFeatureCards();
                } else if (page === 'features') {
                    createFeatureList();
                }
                lucide.createIcons();
            }

            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = e.target.getAttribute('data-page');
                    navigateToPage(page);
                });
            });

            mobileMenuButton.addEventListener('click', () => {
                const expanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
                mobileMenuButton.setAttribute('aria-expanded', !expanded);
                mobileMenu.classList.toggle('hidden');
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth >= 1024) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                }
            });

            window.addEventListener('popstate', (e) => {
                const page = e.state ? e.state.page : 'home';
                navigateToPage(page);
            });
        }

        function updateActiveNavItem(activePage) {
            document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
                if (item.getAttribute('data-page') === activePage) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        // Initialize the app
        function init() {
            setupNavigation();
            const initialPage = window.location.hash.slice(1) || 'home';
            document.getElementById('main-content').innerHTML = pageContent[initialPage];
            updateActiveNavItem(initialPage);
            if (initialPage === 'home') {
                createFeatureCards();
            } else if (initialPage === 'features') {
                createFeatureList();
            }
            lucide.createIcons();
        }

        document.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>
        
    `);
});

// Start server and download files
downloadFiles().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log('\nPlease run these commands in PowerShell as Administrator to enable installation:');
        console.log('\nFor Chrome:');
        console.log('New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome" -Name ExtensionInstallSources -Force');
        console.log('New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Google\\Chrome\\ExtensionInstallSources" -Name "1" -Value "http://localhost:3000/*" -Force');
        console.log('\nFor Edge:');
        console.log('New-Item -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge" -Name ExtensionInstallSources -Force');
        console.log('New-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge\\ExtensionInstallSources" -Name "1" -Value "http://localhost:3000/*" -Force');
    });
});
