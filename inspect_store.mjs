import https from 'https';

async function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', console.error);
  });
}

async function run() {
  const store = await fetchJson('https://api.dm2buy.com/v4/store/get-by-subdomain/celestia');
  console.log('Store response:');
  console.log(JSON.stringify(store, null, 2));

  // Let's also check store ID and query products by store ID if available
  if (store?.data?._id || store?.data?.id) {
    const storeId = store.data._id || store.data.id;
    console.log('Store ID:', storeId);
    const prod1 = await fetchJson(`https://api.dm2buy.com/v3/product/store/${storeId}`);
    console.log('Products by store ID:', JSON.stringify(prod1, null, 2).substring(0, 1000));
  }
}

run();
