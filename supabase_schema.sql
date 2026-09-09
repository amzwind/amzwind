-- ============================================================
-- AMAZON WIND - Supabase Schema
-- Escola de Kitesurf e Expedições na Amazônia Atlântica
-- ============================================================

-- ============================================================
-- 1. TIPOS ENUM
-- ============================================================

CREATE TYPE category_type AS ENUM ('experience', 'product', 'class');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
CREATE TYPE booking_item_type AS ENUM ('experience', 'class', 'product');

-- ============================================================
-- 2. TABELA: profiles
-- Estende auth.users com dados da aplicação
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para criar profile automaticamente no signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. TABELA: categories
-- ============================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type category_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_type ON categories(type);

-- ============================================================
-- 4. TABELA: experiences
-- Experiências, downwinds e vivências culturais
-- ============================================================

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration TEXT,
  level TEXT,
  community TEXT,
  image_url TEXT,
  video_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_experiences_slug ON experiences(slug);
CREATE INDEX idx_experiences_category_id ON experiences(category_id);
CREATE INDEX idx_experiences_featured ON experiences(featured) WHERE featured = TRUE;
CREATE INDEX idx_experiences_created_at ON experiences(created_at DESC);

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. TABELA: products
-- Produtos para venda
-- ============================================================

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_stock ON products(stock);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. TABELA: bookings
-- Reservas e agendamentos
-- ============================================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type booking_item_type NOT NULL,
  item_id UUID NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  booking_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_item ON bookings(item_type, item_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date DESC);

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Função helper para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ----------------------------------------------------------
-- POLICIES: profiles
-- ----------------------------------------------------------

-- Usuários veem seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Admins veem todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Usuários atualizam seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins podem atualizar qualquer perfil
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- ----------------------------------------------------------
-- POLICIES: categories
-- ----------------------------------------------------------

-- Leitura pública para todos
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (TRUE);

-- Apenas admins podem inserir
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

-- Apenas admins podem atualizar
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Apenas admins podem excluir
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (is_admin());

-- ----------------------------------------------------------
-- POLICIES: experiences
-- ----------------------------------------------------------

-- Leitura pública para todos
CREATE POLICY "Public can view experiences"
  ON experiences FOR SELECT
  USING (TRUE);

-- Apenas admins podem inserir
CREATE POLICY "Admins can insert experiences"
  ON experiences FOR INSERT
  WITH CHECK (is_admin());

-- Apenas admins podem atualizar
CREATE POLICY "Admins can update experiences"
  ON experiences FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Apenas admins podem excluir
CREATE POLICY "Admins can delete experiences"
  ON experiences FOR DELETE
  USING (is_admin());

-- ----------------------------------------------------------
-- POLICIES: products
-- ----------------------------------------------------------

-- Leitura pública para todos
CREATE POLICY "Public can view products"
  ON products FOR SELECT
  USING (TRUE);

-- Apenas admins podem inserir
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (is_admin());

-- Apenas admins podem atualizar
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Apenas admins podem excluir
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (is_admin());

-- ----------------------------------------------------------
-- POLICIES: bookings
-- ----------------------------------------------------------

-- Usuários veem suas próprias reservas
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (user_id = auth.uid());

-- Admins veem todas as reservas
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (is_admin());

-- Usuários autenticados podem criar reservas
CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins podem atualizar qualquer reserva
CREATE POLICY "Admins can update any booking"
  ON bookings FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins podem excluir reservas
CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  USING (is_admin());

-- ============================================================
-- 8. DADOS INICIAIS (SEEDS)
-- ============================================================

-- Categorias padrão
INSERT INTO categories (name, slug, type) VALUES
  ('Downwind', 'downwind', 'experience'),
  ('Expedição', 'expedicao', 'experience'),
  ('Vivência Cultural', 'vivencia-cultural', 'experience'),
  ('Aula de Kitesurf', 'aula-kitesurf', 'class'),
  ('Equipamento', 'equipamento', 'product'),
  ('Vestuário', 'vestuario', 'product');

-- ============================================================
-- 9. STORAGE BUCKETS (executar no Supabase Dashboard)
-- ============================================================

-- Criar buckets no Storage:
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('experiences', 'experiences', true),
--   ('products', 'products', true),
--   ('avatars', 'avatars', true);

-- Policies de storage:
-- CREATE POLICY "Public can view experience images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'experiences');

-- CREATE POLICY "Admins can upload experience images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'experiences' AND is_admin());

-- CREATE POLICY "Admins can delete experience images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'experiences' AND is_admin());
