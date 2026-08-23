import https from 'https';

async function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', ...headers }, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Fetching main html...');
  const res = await fetchUrl('https://celestia.dm2buy.com/');
  console.log('HTML length:', res.body.length);
  
  // Find script chunks
  const scriptRegex = /src="(\/_next\/static\/chunks\/[^"]+)"/g;
  let match;
  const scripts = [];
  while ((match = scriptRegex.exec(res.body)) !== null) {
    scripts.push(match[1]);
  }
  console.log('Found script chunks:', scripts);

  // Let's check common DM2Buy backend API endpoints
  const possibleApis = [
    'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/api/v1/store/celestia',
    'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/api/v1/products?store=celestia',
    'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/api/store/celestia/products',
    'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/api/v1/celestia/products',
    'https://celestia.dm2buy.com/api/products',
    'https://celestia.dm2buy.com/api/store',
  ];

  for (const api of possibleApis) {
    try {
      const r = await fetchUrl(api);
      console.log(`API ${api} -> Status: ${r.status}, Length: ${r.body.length}, Preview: ${r.body.substring(0, 150)}`);
    } catch (e) {
      console.log(`API ${api} -> Error: ${e.message}`);
    }
  }

  // Let's search inside scripts for API endpoint patterns
  for (const s of scripts) {
    try {
      const scriptRes = await fetchUrl('https://celestia.dm2buy.com' + s);
      const apisFound = scriptRes.body.match(/https:\/\/[a-zA-Z0-9.-]+\/api\/[^\s"'\)]+/g) || [];
      const paths = scriptRes.body.match(/\/api\/[a-zA-Z0-9_\-\/]+/g) || [];
      if (apisFound.length > 0 || paths.length > 0) {
        console.log(`In ${s}:`);
        if (apisFound.length) console.log('  APIs:', Array.from(new Set(apisFound)));
        if (paths.length) console.log('  Paths:', Array.from(new Set(paths)));
      }
    } catch (e) {
      console.log('Error fetching script', s, e.message);
    }
  }
}

main();
