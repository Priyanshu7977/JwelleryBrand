import fs from 'fs';

const products = JSON.parse(fs.readFileSync('all_celestia_products.json', 'utf8'));

console.log('Total products:', products.length);

// Group by keywords and collections
const bangles = products.filter(p => p.name.toLowerCase().includes('bangle') || p.name.toLowerCase().includes('kada') || p.name.toLowerCase().includes('chuda') || p.collections.some(c => c.toLowerCase().includes('bangle')));
const jewellery = products.filter(p => p.name.toLowerCase().includes('necklace') || p.name.toLowerCase().includes('earring') || p.name.toLowerCase().includes('bracelet') || p.name.toLowerCase().includes('ring') || p.name.toLowerCase().includes('choker') || p.name.toLowerCase().includes('jhumka') || p.name.toLowerCase().includes('pendant') || p.name.toLowerCase().includes('chain'));
const charmsKeychains = products.filter(p => p.name.toLowerCase().includes('keychain') || p.name.toLowerCase().includes('charm') || p.name.toLowerCase().includes('crochet'));
const giftingHampers = products.filter(p => p.name.toLowerCase().includes('hamper') || p.name.toLowerCase().includes('gift') || p.name.toLowerCase().includes('box') || p.name.toLowerCase().includes('polaroid') || p.name.toLowerCase().includes('set'));

console.log(`\nBangles found: ${bangles.length}`);
bangles.slice(0, 10).forEach(b => console.log(` - ${b.name} | ₹${b.price} | Photos: ${b.productPhotos.length} | ${b.productPhotos[0]}`));

console.log(`\nJewellery & Necklaces found: ${jewellery.length}`);
jewellery.slice(0, 15).forEach(j => console.log(` - ${j.name} | ₹${j.price} | Photos: ${j.productPhotos.length} | ${j.productPhotos[0]}`));

console.log(`\nCharms & Accessories found: ${charmsKeychains.length}`);
charmsKeychains.slice(0, 10).forEach(c => console.log(` - ${c.name} | ₹${c.price} | Photos: ${c.productPhotos.length} | ${c.productPhotos[0]}`));

console.log(`\nGifting & Sets found: ${giftingHampers.length}`);
giftingHampers.slice(0, 10).forEach(g => console.log(` - ${g.name} | ₹${g.price} | Photos: ${g.productPhotos.length} | ${g.productPhotos[0]}`));
