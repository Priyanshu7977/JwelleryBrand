import https from 'https';
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'assets', 'products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const products = [
  { name: 'pink-blue-bangles.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/e1h8x1g7c04F.jpg' },
  { name: 'desi-barbie-hamper.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/phRsiwQx7IWJ.jpg' },
  { name: 'white-bangles.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/L5HXP1BvVWlr.jpg' },
  { name: 'polaroids-20.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/iHYmIoDsryDj.jpg' },
  { name: 'red-emerald-set.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/S3ZarxZ7vYOF.jpg' },
  { name: 'anti-tarnish-rings.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/Nb738s5duir8.jpg' },
  { name: 'kashmiri-bangles.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/gbuuvij7kvW6.jpg' },
  { name: 'honeybee-keychain.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/pwkpCv4yiYzA.jpg' },
  { name: 'purple-tulip-hamper.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/vXHOg36h1D81.jpg' },
  { name: 'ice-cream-crochet.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/oap6v2KcJo0s.jpg' },
  { name: 'messi-ronaldo.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/buACy33vvxpT.jpg' },
  { name: 'clear-photo-keychain.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/iSWUlT6abFwx.jpg' },
  { name: 'heavy-jhumka.jpg', url: 'https://dm2buy-aqbqh9cwb5cwb9he.z02.azurefd.net/dm2buy/qoAyDck2GYEo.jpg' }
];

async function download(item) {
  return new Promise((resolve) => {
    const dest = path.join(outDir, item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, { rejectUnauthorized: false }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${item.name} (${fs.statSync(dest).size} bytes)`);
          resolve(true);
        });
      } else {
        console.error(`Failed ${item.name}: status ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`Error downloading ${item.name}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  for (const p of products) {
    await download(p);
  }
}

run();
