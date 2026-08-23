import https from 'https';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const indexJs = await fetchUrl('https://celestia.dm2buy.com/_next/static/chunks/pages/index-5d7548554c023108.js');
  const appJs = await fetchUrl('https://celestia.dm2buy.com/_next/static/chunks/pages/_app-229df23452305134.js');
  const chunk1 = await fetchUrl('https://celestia.dm2buy.com/_next/static/chunks/449-a08e7dc4f2d7fc5f.js');
  
  console.log('--- Matching URLs and APIs ---');
  const combined = indexJs + appJs + chunk1;
  const urls = combined.match(/https?:\/\/[^\s"'\)\`]+/g) || [];
  console.log('URLs:', Array.from(new Set(urls)));

  // Search for store name or api patterns
  const apiPatterns = combined.match(/["'](\/[a-zA-Z0-9_\-\/]+)["']/g) || [];
  const filteredPaths = apiPatterns.filter(p => p.includes('product') || p.includes('store') || p.includes('catalog') || p.includes('item') || p.includes('graphql') || p.includes('v1'));
  console.log('Filtered paths:', Array.from(new Set(filteredPaths)).slice(0, 30));
}

run();
