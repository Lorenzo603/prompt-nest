#!/usr/bin/env node

/**
 * Test the access control middleware
 * Usage: node scripts/test-auth.js [url] [token]
 */

const https = require('https');
const http = require('http');

async function testAccess(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {}
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 200) // First 200 chars
        });
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  const url = args[0] || 'http://localhost:3000';
  const token = args[1];
  
  console.log('\n🔐 Access Control Test\n');
  console.log(`Testing URL: ${url}`);
  console.log(`Token provided: ${token ? 'Yes' : 'No'}\n`);
  
  try {
    console.log('Testing without token...');
    const unauthorizedResult = await testAccess(url);
    console.log(`Status: ${unauthorizedResult.status}`);
    console.log(`Response preview: ${unauthorizedResult.body.substring(0, 100)}...\n`);
    
    if (token) {
      console.log('Testing with token...');
      const authorizedResult = await testAccess(url, token);
      console.log(`Status: ${authorizedResult.status}`);
      console.log(`Response preview: ${authorizedResult.body.substring(0, 100)}...\n`);
    }
    
    console.log('✅ Test completed');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

if (require.main === module) {
  main();
}
