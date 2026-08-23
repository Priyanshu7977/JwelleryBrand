import https from 'https';
import fs from 'fs';

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const storeId = 'f896f302e46a259028f5803ccabe7b20';
  let allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetchJson(`https://api.dm2buy.com/v3/product/store/${storeId}?limit=50&page=${page}`);
    if (res && res.data && res.data.docs) {
      allProducts = allProducts.concat(res.data.docs);
      console.log(`Page ${page}: got ${res.data.docs.length} products (Total so far: ${allProducts.length})`);
      if (res.data.hasNextPage) {
        page = res.data.nextPage;
      } else {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  console.log(`\nSuccessfully fetched TOTAL of ${allProducts.length} REAL Celestia products!`);
  
  // Format summary of all products
  const formatted = allProducts.map((p, idx) => ({
    id: p._id || p.id,
    name: p.name || p.title,
    price: p.price,
    compareAtPrice: p.compareAtPrice || p.mrp || p.originalPrice || undefined,
    availableStock: p.availableStock,
    productPhotos: p.productPhotos || [],
    collections: (p.collectionV2 || []).map(c => c.name),
    description: p.description || '',
    slug: p.slug || p._id,
    url: `https://celestia.dm2buy.com/product/${p.slug || p._id}`,
    isFeatured: p.isFeatured
  }));

  fs.writeFileSync('all_celestia_products.json', JSON.stringify(formatted, null, 2));
  console.log('Saved all products to all_celestia_products.json');

  // Print summary of top products
  console.log('\n--- First 15 Products ---');
  formatted.slice(0, 15).forEach((p, i) => {
    console.log(`${i + 1}. [${p.name}] - Price: ₹${p.price} (Stock: ${p.availableStock}) - Photos: ${p.productPhotos.length} - Cats: [${p.collections.join(', ')}]`);
    console.log(`   Hero Photo: ${p.productPhotos[0]}`);
  });
}

run();
