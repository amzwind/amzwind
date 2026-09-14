-- ============================================================
-- Migration: 20260914050000_admin_backoffice_policies.sql
-- Description: Backoffice administrativo — policies para moderação
--              da comunidade (posts e comentários do feed).
--              Permite que admins visualizem e removam qualquer
--              conteúdo que viole as diretrizes.
-- Aplica-se com: supabase db push  (ou rodar no SQL Editor)
-- ============================================================

-- 1. POSTS: admins veem todos e podem remover qualquer post
DROP POLICY IF EXISTS "Admins can view all posts" ON posts;
CREATE POLICY "Admins can view all posts"
  ON posts FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete any post" ON posts;
CREATE POLICY "Admins can delete any post"
  ON posts FOR DELETE
  USING (is_admin());

-- 2. POST_COMMENTS: admins veem todos e podem remover qualquer comentário
DROP POLICY IF EXISTS "Admins can view all post comments" ON post_comments;
CREATE POLICY "Admins can view all post comments"
  ON post_comments FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete any post comment" ON post_comments;
CREATE POLICY "Admins can delete any post comment"
  ON post_comments FOR DELETE
  USING (is_admin());
