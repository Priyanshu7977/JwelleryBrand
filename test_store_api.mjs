import https from 'https';

async function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function run() {
  const apis = [
    'https://api.dm2buy.com/v4/store/get-by-subdomain/celestia',
    'https://api.dm2buy.com/v2/store/get-subdomain/celestia',
    'https://kela.api.dm2buy.com/v4/store/get-by-subdomain/celestia',
    'https://kela.api.dm2buy.com/v2/store/get-subdomain/celestia',
    'https://api.dm2buy.com/v3/product/store/celestia',
    'https://api.dm2buy.com/v4/product/store/celestia',
    'https://api.dm2buy.com/v1/store/celestia',
  ];

  for (const url of apis) {
    const res = await fetchJson(url);
    console.log(`URL: ${url}`);
    console.log(`Status: ${res.status}`);
    if (res.data) {
      console.log('Keys:', Object.keys(res.data));
      console.log('Sample Data:', JSON.stringify(res.data).substring(0, 300));
    } else {
      console.log('Raw preview:', String(res.raw || res.error).substring(0, 200));
    }
    console.log('-------------------------');
  }
}

run();
