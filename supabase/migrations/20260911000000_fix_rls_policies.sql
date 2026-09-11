-- ============================================================
-- AMAZON WIND - RLS Policy Fix Migration
-- Resolve "new row violates row-level security policy" errors
-- for admin operations (classes, experiences, products, etc.)
-- and public inserts (contacts, bookings).
-- ============================================================

-- ============================================================
-- 1. TABLES: Enable RLS + Create Policies
-- ============================================================

-- ── profiles ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public can read profiles (for display names, avatars)
CREATE POLICY "Public can read profiles"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can do everything on profiles
CREATE POLICY "Admins full access on profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ── categories ──
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins full access on categories"
  ON categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ── experiences ──
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read experiences"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Admins full access on experiences"
  ON experiences FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ── products ──
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Admins full access on products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ── classes ──
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read classes"
  ON classes FOR SELECT
  USING (true);

CREATE POLICY "Admins full access on classes"
  ON classes FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ── bookings ──
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public can read own bookings (by user_id)
CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Public can insert bookings (checkout flow, service form)
CREATE POLICY "Public can insert bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Users can update own bookings (cancel)
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins full access on bookings
CREATE POLICY "Admins full access on bookings"
  ON bookings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ── contacts ──
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Public can insert contacts (contact form + newsletter)
CREATE POLICY "Public can insert contacts"
  ON contacts FOR INSERT
  WITH CHECK (true);

-- Admins can read/delete contacts
CREATE POLICY "Admins full access on contacts"
  ON contacts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ── hero_slides ──
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read hero_slides"
  ON hero_slides FOR SELECT
  USING (true);

CREATE POLICY "Admins full access on hero_slides"
  ON hero_slides FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ── financial_accounts ──
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins full access on financial_accounts"
  ON financial_accounts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow insert from checkout (cart flow) - user_id based
CREATE POLICY "Authenticated can insert financial_accounts"
  ON financial_accounts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);


-- ── about_page ──
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read about_page"
  ON about_page FOR SELECT
  USING (true);

CREATE POLICY "Admins full access on about_page"
  ON about_page FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ============================================================
-- 2. STORAGE: Enable RLS + Create Policies
-- ============================================================

-- ── avatars bucket ──
-- Allow authenticated users to upload to avatars bucket
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

-- Public can view avatars
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

-- Users can update/delete their own avatars
CREATE POLICY "Users can update own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ── experiences bucket (generic uploads for admin) ──
-- Authenticated users can upload to experiences bucket
CREATE POLICY "Authenticated users can upload to experiences"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'experiences');

-- Public can view experiences files
CREATE POLICY "Public can view experiences files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'experiences');

-- Authenticated users can update/delete experiences files
CREATE POLICY "Authenticated can update experiences files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'experiences');

CREATE POLICY "Authenticated can delete experiences files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'experiences');
