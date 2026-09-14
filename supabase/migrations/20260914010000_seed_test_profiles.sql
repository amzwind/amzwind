-- ============================================================
-- FASE 18: Seed test profiles for Friends/Community validation
-- These are fictional users for development/testing only.
-- They use stable UUIDs that will never conflict with real users.
-- ============================================================

DO $$
DECLARE
  v_ids UUID[] := ARRAY[
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006'
  ];
  v_names TEXT[] := ARRAY[
    'Lucas Ventos', 'Marina Kite', 'Pedro Downwind',
    'Ana Surf', 'Carlos Rider'
  ];
  v_avatars TEXT[] := ARRAY[
    'https://i.pravatar.cc/150?img=11',
    'https://i.pravatar.cc/150?img=23',
    'https://i.pravatar.cc/150?img=56',
    'https://i.pravatar.cc/150?img=44',
    'https://i.pravatar.cc/150?img=68'
  ];
  v_emails TEXT[] := ARRAY[
    'lucas.ventos@test.amzwind.com.br',
    'marina.kite@test.amzwind.com.br',
    'pedro.downwind@test.amzwind.com.br',
    'ana.surf@test.amzwind.com.br',
    'carlos.rider@test.amzwind.com.br'
  ];
  i INT;
BEGIN
  IF EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000002'::UUID
  ) THEN
    RAISE NOTICE 'Test profiles already seeded — skipping.';
    RETURN;
  END IF;

  FOR i IN 1..5 LOOP
    INSERT INTO auth.users (
      id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, aud, role
    )
    VALUES (
      v_ids[i],
      v_emails[i],
      crypt('TestPass123!', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('full_name', v_names[i])::jsonb,
      'authenticated', 'authenticated'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO profiles (id, full_name, avatar_url, role, created_at, updated_at)
    VALUES (v_ids[i], v_names[i], v_avatars[i], 'customer', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  RAISE NOTICE 'Test profiles seed concluído: 5 perfis inseridos.';
END $$;
