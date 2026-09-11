-- ============================================================
-- AMAZON WIND - RLS Policy Fix Migration (IDEMPOTENT)
-- Safe to re-run: uses DROP POLICY IF EXISTS before each CREATE.
-- Resolves "new row violates row-level security policy" errors.
-- ============================================================

-- ============================================================
-- 1. TABLES: Enable RLS + Create Policies
-- ============================================================

-- ── profiles ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read profiles" ON profiles;
CREATE POLICY "Public can read profiles"
  ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins full access on profiles" ON profiles;
CREATE POLICY "Admins full access on profiles"
  ON profiles FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── categories ──
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read categories" ON categories;
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access on categories" ON categories;
CREATE POLICY "Admins full access on categories"
  ON categories FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── experiences ──
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read experiences" ON experiences;
CREATE POLICY "Public can read experiences"
  ON experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access on experiences" ON experiences;
CREATE POLICY "Admins full access on experiences"
  ON experiences FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── products ──
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read products" ON products;
CREATE POLICY "Public can read products"
  ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access on products" ON products;
CREATE POLICY "Admins full access on products"
  ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── classes ──
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read classes" ON classes;
CREATE POLICY "Public can read classes"
  ON classes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access on classes" ON classes;
CREATE POLICY "Admins full access on classes"
  ON classes FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── bookings ──
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
CREATE POLICY "Public can insert bookings"
  ON bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins full access on bookings" ON bookings;
CREATE POLICY "Admins full access on bookings"
  ON bookings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── contacts ──
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert contacts" ON contacts;
CREATE POLICY "Public can insert contacts"
  ON contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access on contacts" ON contacts;
CREATE POLICY "Admins full access on contacts"
  ON contacts FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── hero_slides ──
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read hero_slides" ON hero_slides;
CREATE POLICY "Public can read hero_slides"
  ON hero_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access on hero_slides" ON hero_slides;
CREATE POLICY "Admins full access on hero_slides"
  ON hero_slides FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── financial_accounts ──
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins full access on financial_accounts" ON financial_accounts;
CREATE POLICY "Admins full access on financial_accounts"
  ON financial_accounts FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Authenticated can insert financial_accounts" ON financial_accounts;
CREATE POLICY "Authenticated can insert financial_accounts"
  ON financial_accounts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ── about_page ──
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read about_page" ON about_page;
CREATE POLICY "Public can read about_page"
  ON about_page FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access on about_page" ON about_page;
CREATE POLICY "Admins full access on about_page"
  ON about_page FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));


-- ============================================================
-- 2. STORAGE: Enable RLS + Create Policies
-- ============================================================

-- ── Create about bucket if not exists ──
INSERT INTO storage.buckets (id, name, public)
VALUES ('about', 'about', true)
ON CONFLICT (id) DO NOTHING;

-- ── avatars bucket ──
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
CREATE POLICY "Users can update own avatars"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ── experiences bucket (generic uploads for admin) ──
DROP POLICY IF EXISTS "Authenticated users can upload to experiences" ON storage.objects;
CREATE POLICY "Authenticated users can upload to experiences"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'experiences');

DROP POLICY IF EXISTS "Public can view experiences files" ON storage.objects;
CREATE POLICY "Public can view experiences files"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'experiences');

DROP POLICY IF EXISTS "Authenticated can update experiences files" ON storage.objects;
CREATE POLICY "Authenticated can update experiences files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'experiences');

DROP POLICY IF EXISTS "Authenticated can delete experiences files" ON storage.objects;
CREATE POLICY "Authenticated can delete experiences files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'experiences');


-- ── about bucket (about page cover images) ──
DROP POLICY IF EXISTS "Authenticated users can upload to about" ON storage.objects;
CREATE POLICY "Authenticated users can upload to about"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'about');

DROP POLICY IF EXISTS "Public can view about files" ON storage.objects;
CREATE POLICY "Public can view about files"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'about');

DROP POLICY IF EXISTS "Authenticated can update about files" ON storage.objects;
CREATE POLICY "Authenticated can update about files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'about');

DROP POLICY IF EXISTS "Authenticated can delete about files" ON storage.objects;
CREATE POLICY "Authenticated can delete about files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'about');
