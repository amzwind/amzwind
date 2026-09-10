-- ============================================================
-- AMAZON WIND - Migration: RLS Fixes + Contacts Table
-- ============================================================

-- ============================================================
-- 1. TABELA: contacts (contato e newsletter)
-- Separa submits de contato/newsletter do fluxo de bookings
-- ============================================================

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type TEXT NOT NULL CHECK (contact_type IN ('contact', 'newsletter')),
  full_name TEXT,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_type ON contacts(contact_type);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode inserir contatos (formulários públicos)
CREATE POLICY "Anyone can insert contacts"
  ON contacts FOR INSERT
  WITH CHECK (TRUE);

-- Admins podem ver todos os contatos
CREATE POLICY "Admins can view all contacts"
  ON contacts FOR SELECT
  USING (is_admin());

-- Admins podem deletar contatos
CREATE POLICY "Admins can delete contacts"
  ON contacts FOR DELETE
  USING (is_admin());

-- ============================================================
-- 2. FIX RLS: bookings - permitir inserts anônimos e autenticados
-- ============================================================

-- Remover policy antiga que bloqueava inserts
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON bookings;

-- Usuários autenticados criam bookings com seu próprio user_id
CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );
