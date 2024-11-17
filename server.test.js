const request = require('supertest');
const express = require('express');
const app = express();

// Import your express app configuration
require('./server');

describe('Server Endpoints', () => {
  test('GET / should return 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Linkumori Extension');
  });

  test('GET /extension.crx should return correct content type', async () => {
    const response = await request(app).get('/extension.crx');
    expect(response.headers['content-type']).toBe('application/x-chrome-extension');
  });

  test('GET /updates.xml should return correct content type', async () => {
    const response = await request(app).get('/updates.xml');
    expect(response.headers['content-type']).toBe('application/xml');
  });
});