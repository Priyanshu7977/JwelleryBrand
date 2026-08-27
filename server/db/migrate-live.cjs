const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runLiveMigration() {
  const connectionString = 'postgresql://postgres.olifntjfwaywigwfovqb:Priyanshu%40200620@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres';
  console.log('Connecting to live Supabase PostgreSQL (ap-southeast-1)...');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log('✓ Connected securely to Supabase PostgreSQL!');

    const sqlPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying 001_initial_schema.sql...');
    await client.query(sql);
    console.log('✓ DDL Migration applied successfully!');

    // Enable Row Level Security and add public read / service access policies
    console.log('Configuring Row Level Security (RLS) policies...');
    const rlsSql = `
      -- Enable RLS on public tables
      ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS product_variants ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS order_tracking_events ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS contact_inquiries ENABLE ROW LEVEL SECURITY;

      -- Allow public read access on catalog products and variants
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public products are viewable by everyone' AND tablename = 'products') THEN
          CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
        END IF;
      END $$;

      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public variants are viewable by everyone' AND tablename = 'product_variants') THEN
          CREATE POLICY "Public variants are viewable by everyone" ON product_variants FOR SELECT USING (true);
        END IF;
      END $$;

      -- Allow public tracking query by tracking number or order number
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view tracking milestones' AND tablename = 'order_tracking_events') THEN
          CREATE POLICY "Public can view tracking milestones" ON order_tracking_events FOR SELECT USING (true);
        END IF;
      END $$;

      -- Allow public contact submission
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can submit inquiries' AND tablename = 'contact_inquiries') THEN
          CREATE POLICY "Public can submit inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
        END IF;
      END $$;
    `;
    await client.query(rlsSql);
    console.log('✓ RLS Policies configured securely!');

    // Seed initial catalogue products if empty
    const prodCountRes = await client.query('SELECT COUNT(*) as count FROM products');
    const count = parseInt(prodCountRes.rows[0].count, 10);
    console.log(`Current product count in database: ${count}`);

    if (count === 0) {
      console.log('Seeding initial atelier catalog into PostgreSQL...');
      const seedSql = `
        INSERT INTO products (id, handle, title, description, category, price, compare_at_price, material, craftsmanship, same_day_mumbai_available, hero_image, gallery_images, tags, is_active)
        VALUES
        ('pink-blue-bangles', 'pink-and-blue-bangle-set-of-2', 'pink and blue bangle set of 2', '18K dual gold-dipped brass cuffs with hand-painted pastel pink and sky blue glass enamel.', 'bangles', 150, 299, '18K Gold Plated Brass & Hand-Poured Glass Enamel', 'Hand-finished in Mumbai atelier. Dual-layer anti-tarnish protective sealing.', true, '/assets/products/pink-blue-bangles.jpg', '["/assets/products/pink-blue-bangles.jpg"]'::jsonb, '["Bangles","Handcrafted","Enamel","Anti-Tarnish"]'::jsonb, true),
        ('desi-barbie-hamper', 'desi-barbie-hamper', 'Desi Barbie Hamper', 'A bespoke celebratory gift hamper complete with handcrafted jewellery, retro Polaroid prints, and archival stationery.', 'gifting', 150, 1299, 'Handmade Velvet Keepsake Box, Silk Ribbon, Fuji Polaroid', 'Hand-assembled and sealed with custom gold wax stamp in Mumbai atelier.', true, '/assets/products/desi-barbie-hamper.jpg', '["/assets/products/desi-barbie-hamper.jpg"]'::jsonb, '["Gift Hamper","Personalised","Celebration","Polaroid"]'::jsonb, true),
        ('white-bangles', 'white-bangles', 'white bangles', 'Pristine pearl-finish ivory and gold bangles engineered for timeless elegance.', 'bangles', 150, 350, '18K Gold PVD Coating over Brass with Ivory Resins', 'Precision sized and hand-buffed for silk-smooth comfort profile.', true, '/assets/products/white-bangles.jpg', '["/assets/products/white-bangles.jpg"]'::jsonb, '["Bangles","Minimalist","Waterproof"]'::jsonb, true),
        ('red-emerald-set', 'exclusive-red-emerald-set', 'Exclusive Red Emerald set', 'High-jewelry royal red and simulated emerald choker with matching architectural drop earrings.', 'fine-jewellery', 150, 1599, '18K Dual Gold Plating, Synthetic Ruby & Emerald Facets', 'Hand-set prong mounts with mirror-polished backings and secure lock clasps.', true, '/assets/products/red-emerald-set.jpg', '["/assets/products/red-emerald-set.jpg"]'::jsonb, '["Fine Jewellery","Necklace Set","Gemstones","Signature"]'::jsonb, true),
        ('anti-tarnish-rings', 'golden-anti-tarnish-rings', 'Golden anti tarnish rings', 'Waterproof everyday gold statement and minimal band rings designed to never fade.', 'fine-jewellery', 150, 599, '316L Surgical Stainless Steel & 18K Real Gold PVD', 'Tested against perfumes, chlorine, and lotions. 100% hypoallergenic.', true, '/assets/products/anti-tarnish-rings.jpg', '["/assets/products/anti-tarnish-rings.jpg"]'::jsonb, '["Rings","Anti-Tarnish","Waterproof","Everyday"]'::jsonb, true),
        ('polaroids-20', 'polaroids-20-your-pics', 'polaroids 20(your pics)', 'Custom photo pack of 20 retro Fuji polaroid-style prints on archival glossy cardstock.', 'personalised', 150, 400, 'Archival 300 GSM Photographic Fuji Film Finish', 'Calibrated color profiling with protective UV laminate.', true, '/assets/products/polaroids-20.jpg', '["/assets/products/polaroids-20.jpg"]'::jsonb, '["Polaroids","Custom Photo","Keepsake"]'::jsonb, true)
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO product_variants (id, product_id, sku, title, price, inventory_quantity, size)
        VALUES
        ('var-pb-24', 'pink-blue-bangles', 'PB-24', 'Size 2.4', 150, 45, '2.4'),
        ('var-pb-26', 'pink-blue-bangles', 'PB-26', 'Size 2.6', 150, 80, '2.6'),
        ('var-pb-28', 'pink-blue-bangles', 'PB-28', 'Size 2.8', 150, 30, '2.8'),
        ('var-dbh-std', 'desi-barbie-hamper', 'HAMPER-DB-01', 'Curated Hamper', 150, 25, NULL),
        ('var-wb-24', 'white-bangles', 'WB-24', 'Size 2.4', 150, 50, '2.4'),
        ('var-wb-26', 'white-bangles', 'WB-26', 'Size 2.6', 150, 65, '2.6'),
        ('var-res-one', 'red-emerald-set', 'RES-01', 'Adjustable', 150, 14, NULL),
        ('var-atr-adj', 'anti-tarnish-rings', 'ATR-ADJ', 'Comfort Fit', 150, 120, NULL),
        ('var-pol-20', 'polaroids-20', 'POL-20', '20 Photos', 150, 200, NULL)
        ON CONFLICT (id) DO NOTHING;
      `;
      await client.query(seedSql);
      console.log('✓ Initial atelier catalog and variants seeded into PostgreSQL!');
    }

    const tablesRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
    );
    console.log('Active Public Database Tables:');
    tablesRes.rows.forEach((r) => console.log('  - ' + r.table_name));

    await client.end();
    console.log('✓ Live Migration & Seed Completed Successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    try {
      await client.end();
    } catch {}
    process.exit(1);
  }
}

runLiveMigration();
