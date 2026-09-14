-- ============================================================
-- Migration: 20260914040000_create_orders_table.sql
-- Description: Gateway de Pagamento / Checkout — tabela orders
--              para reservas de Trips e Experiências.
-- Aplica-se com: supabase db push  (ou rodar no SQL Editor)
-- ============================================================

-- 1. TABELA: orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('trip', 'experience')),
  item_id TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  payment_provider_id TEXT,
  payment_method TEXT CHECK (payment_method IS NULL OR payment_method IN ('pix', 'card')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_item ON orders(item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Reusa o trigger de updated_at criado no schema base (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
    CREATE TRIGGER update_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;

-- 2. ROW LEVEL SECURITY
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Usuário autenticado visualiza apenas os próprios pedidos/reservas
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

-- Usuário autenticado pode criar pedidos apenas para si mesmo
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuário pode cancelar (atualizar status) apenas os próprios pedidos
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins veem todos os pedidos
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (is_admin());

-- Admins podem atualizar qualquer pedido
DROP POLICY IF EXISTS "Admins can update any order" ON orders;
CREATE POLICY "Admins can update any order"
  ON orders FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins podem excluir pedidos
DROP POLICY IF EXISTS "Admins can delete orders" ON orders;
CREATE POLICY "Admins can delete orders"
  ON orders FOR DELETE
  USING (is_admin());
