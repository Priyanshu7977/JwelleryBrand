-- ============================================================================
-- CELESTIA LUXURY ATELIER - SUPABASE / POSTGRES DATABASE SCHEMA
-- ============================================================================

-- 1. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    tier TEXT DEFAULT 'Circle Member' CHECK (tier IN ('Circle Member', 'Patron', 'VIP Atelier')),
    orders_count INTEGER DEFAULT 0,
    saved_addresses JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. ORDERS METADATA TABLE (Shopify & Custom orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. ORD-2026-8941 or Shopify #1042
    shopify_order_id TEXT,
    shopify_checkout_id TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB NOT NULL, -- { street, city, state, pincode, country }
    shipping_method TEXT NOT NULL, -- 'Mumbai Same-Day Express Courier' | 'Pan-India Free Express Air Delivery'
    payment_method TEXT NOT NULL, -- 'UPI' | 'CARD' | 'COD' | 'WHATSAPP' | 'SHOPIFY_PAY'
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    financial_status TEXT DEFAULT 'paid' CHECK (financial_status IN ('pending', 'paid', 'refunded')),
    fulfillment_status TEXT DEFAULT 'confirmed' CHECK (fulfillment_status IN ('confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id OR customer_email = auth.email());

-- 3. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    shopify_variant_id TEXT,
    title TEXT NOT NULL,
    handle TEXT NOT NULL,
    image_url TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    box_type TEXT,
    custom_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items of own orders" 
ON public.order_items FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE public.orders.id = public.order_items.order_id 
        AND (public.orders.user_id = auth.uid() OR public.orders.customer_email = auth.email())
    )
);

-- 4. DELIVERY TRACKING TABLE (Live Carrier Updates)
CREATE TABLE IF NOT EXISTS public.delivery_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_number TEXT UNIQUE NOT NULL, -- e.g. MUM-EXPRESS-9921 or BD-8829104
    carrier TEXT NOT NULL DEFAULT 'Mumbai Atelier Express', -- 'Mumbai Atelier Express' | 'Delhivery Air' | 'Bluedart Express'
    current_status TEXT NOT NULL DEFAULT 'confirmed',
    estimated_delivery_start TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_delivery_end TIMESTAMP WITH TIME ZONE NOT NULL,
    destination_city TEXT NOT NULL,
    timeline_events JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { stage, title, description, timestamp, location, completed }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Delivery Tracking
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone with tracking number can view tracking" 
ON public.delivery_tracking FOR SELECT 
USING (true);

-- 5. USER WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    handle TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist" 
ON public.wishlist_items FOR ALL 
USING (auth.uid() = user_id);

-- INDEXES FOR FAST LOOKUPS
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_tracking_order_id ON public.delivery_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_number ON public.delivery_tracking(tracking_number);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist_items(user_id);
