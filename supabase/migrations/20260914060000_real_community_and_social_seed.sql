-- ============================================================
-- Migration: 20260914060000_real_community_and_social_seed.sql
-- Description: Seed real da comunidade AMZWind — riders, amizades,
--              posts, curtidas, comentários, conversas, mensagens
--              e trips georreferenciadas.
--
-- Segue o padrão de supabase/migrations/20260914010000
-- (auth.users via crypt + profiles). Idempotente: pode rodar
-- mais de uma vez sem duplicar (ON CONFLICT / NOT EXISTS).
-- Aplica-se com: supabase db push (ou rodar no SQL Editor)
-- ============================================================

-- ------------------------------------------------------------
-- 0. Usuários + perfis (UUIDs estáveis 101..110)
-- ------------------------------------------------------------

DO $$
DECLARE
  v_ids UUID[] := ARRAY[
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000105',
    '00000000-0000-0000-0000-000000000106',
    '00000000-0000-0000-0000-000000000107',
    '00000000-0000-0000-0000-000000000108',
    '00000000-0000-0000-0000-000000000109',
    '00000000-0000-0000-0000-000000000110'
  ];
  v_names TEXT[] := ARRAY[
    'João Fonseca', 'Marina Vento', 'Carlos Rider', 'Ana Maré',
    'Pedro Dunas', 'Luiza Kite', 'Rafael Brisa', 'Camila Ondas',
    'Thiago Vela', 'Beatriz Sal'
  ];
  v_avatars TEXT[] := ARRAY[
    'https://i.pravatar.cc/150?img=12',
    'https://i.pravatar.cc/150?img=47',
    'https://i.pravatar.cc/150?img=53',
    'https://i.pravatar.cc/150?img=44',
    'https://i.pravatar.cc/150?img=59',
    'https://i.pravatar.cc/150?img=31',
    'https://i.pravatar.cc/150?img=68',
    'https://i.pravatar.cc/150?img=26',
    'https://i.pravatar.cc/150?img=15',
    'https://i.pravatar.cc/150?img=38'
  ];
  v_emails TEXT[] := ARRAY[
    'joao.fonseca@amzwind.com.br',
    'marina.vento@amzwind.com.br',
    'carlos.rider@amzwind.com.br',
    'ana.mare@amzwind.com.br',
    'pedro.dunas@amzwind.com.br',
    'luiza.kite@amzwind.com.br',
    'rafael.brisa@amzwind.com.br',
    'camila.ondas@amzwind.com.br',
    'thiago.vela@amzwind.com.br',
    'beatriz.sal@amzwind.com.br'
  ];
  i INT;
BEGIN
  FOR i IN 1..10 LOOP
    INSERT INTO auth.users (
      id, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, aud, role
    )
    VALUES (
      v_ids[i],
      v_emails[i],
      crypt('AmzWind2026!', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}',
      json_build_object('full_name', v_names[i], 'avatar_url', v_avatars[i])::jsonb,
      'authenticated', 'authenticated'
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO profiles (id, full_name, avatar_url, role, created_at, updated_at)
    VALUES (v_ids[i], v_names[i], v_avatars[i], 'customer', now(), now())
    ON CONFLICT (id) DO NOTHING;
  END LOOP;

  RAISE NOTICE 'Seed riders AMZWind concluído: 10 perfis.';
END $$;

-- ------------------------------------------------------------
-- 1. Amizades aceitas (relações bidirecionais únicas)
-- ------------------------------------------------------------

INSERT INTO friendships (user_id, friend_id)
SELECT a, b
FROM (VALUES
  ('00000000-0000-0000-0000-000000000101'::UUID, '00000000-0000-0000-0000-000000000102'::UUID),
  ('00000000-0000-0000-0000-000000000101'::UUID, '00000000-0000-0000-0000-000000000103'::UUID),
  ('00000000-0000-0000-0000-000000000101'::UUID, '00000000-0000-0000-0000-000000000110'::UUID),
  ('00000000-0000-0000-0000-000000000102'::UUID, '00000000-0000-0000-0000-000000000104'::UUID),
  ('00000000-0000-0000-0000-000000000102'::UUID, '00000000-0000-0000-0000-000000000108'::UUID),
  ('00000000-0000-0000-0000-000000000102'::UUID, '00000000-0000-0000-0000-000000000106'::UUID),
  ('00000000-0000-0000-0000-000000000104'::UUID, '00000000-0000-0000-0000-000000000110'::UUID),
  ('00000000-0000-0000-0000-000000000105'::UUID, '00000000-0000-0000-0000-000000000109'::UUID),
  ('00000000-0000-0000-0000-000000000103'::UUID, '00000000-0000-0000-0000-000000000107'::UUID),
  ('00000000-0000-0000-0000-000000000106'::UUID, '00000000-0000-0000-0000-000000000109'::UUID),
  ('00000000-0000-0000-0000-000000000108'::UUID, '00000000-0000-0000-0000-000000000104'::UUID),
  ('00000000-0000-0000-0000-000000000110'::UUID, '00000000-0000-0000-0000-000000000105'::UUID)
) AS v(a, b)
WHERE NOT EXISTS (
  SELECT 1 FROM friendships f
  WHERE (f.user_id = v.a AND f.friend_id = v.b)
     OR (f.user_id = v.b AND f.friend_id = v.a)
);

-- ------------------------------------------------------------
-- 2. Pedidos de amizade (2 pendentes + 1 aceito com amizade)
-- ------------------------------------------------------------

INSERT INTO friend_requests (sender_id, receiver_id, status)
VALUES
  ('00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000101', 'pending'),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000102', 'pending'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000104', 'accepted')
ON CONFLICT (sender_id, receiver_id) DO NOTHING;

INSERT INTO friendships (user_id, friend_id)
SELECT '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000104'
WHERE NOT EXISTS (
  SELECT 1 FROM friendships f
  WHERE (f.user_id = '00000000-0000-0000-0000-000000000103' AND f.friend_id = '00000000-0000-0000-0000-000000000104')
     OR (f.user_id = '00000000-0000-0000-0000-000000000104' AND f.friend_id = '00000000-0000-0000-0000-000000000103')
);

-- ------------------------------------------------------------
-- 3. Posts do feed (contadores zerados; triggers somam likes/comments)
-- ------------------------------------------------------------

INSERT INTO posts (id, user_id, content, media_url, likes_count, comments_count, shares_count, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000102',
    'Turma de iniciantes de hoje mandou muito bem na Lagoa do Atalaia! Vento constante de 20 nós e ninguém queria sair da água. #KiteSchool #Salinas',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    0, 0, 0, now() - INTERVAL '4 hours', now() - INTERVAL '4 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000101',
    'Downwind Alter → Ponta do Cururu concluído! 18km de água flat, botos acompanhando o grupo e aquele pôr do sol... Quem vem na próxima?',
    NULL,
    0, 0, 0, now() - INTERVAL '9 hours', now() - INTERVAL '9 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000110',
    'Cheguei em Barreirinhas! Olhem essa lagoa... amanhã tem travessia das dunas. Ansiedade define.',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    0, 0, 0, now() - INTERVAL '14 hours', now() - INTERVAL '14 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000106',
    'Dia 12 de aula: consegui o water start dos dois lados!! Obrigada pela paciência infinita da minha instrutora!',
    NULL,
    0, 0, 0, now() - INTERVAL '22 hours', now() - INTERVAL '22 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000205',
    '00000000-0000-0000-0000-000000000105',
    'Temporada das lagoas oficialmente ABERTA. Água no nível perfeito e vento NE de 22 nós. Vagas abertas para a travessia de junho!',
    'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
    0, 0, 0, now() - INTERVAL '31 hours', now() - INTERVAL '31 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- 4. Curtidas (triggers atualizam likes_count + notificações)
-- ------------------------------------------------------------

INSERT INTO post_likes (post_id, user_id)
SELECT p, u
FROM (VALUES
  ('00000000-0000-0000-0000-000000000201'::UUID, '00000000-0000-0000-0000-000000000101'::UUID),
  ('00000000-0000-0000-0000-000000000201'::UUID, '00000000-0000-0000-0000-000000000103'::UUID),
  ('00000000-0000-0000-0000-000000000201'::UUID, '00000000-0000-0000-0000-000000000110'::UUID),
  ('00000000-0000-0000-0000-000000000202'::UUID, '00000000-0000-0000-0000-000000000102'::UUID),
  ('00000000-0000-0000-0000-000000000202'::UUID, '00000000-0000-0000-0000-000000000110'::UUID),
  ('00000000-0000-0000-0000-000000000203'::UUID, '00000000-0000-0000-0000-000000000101'::UUID),
  ('00000000-0000-0000-0000-000000000203'::UUID, '00000000-0000-0000-0000-000000000102'::UUID),
  ('00000000-0000-0000-0000-000000000203'::UUID, '00000000-0000-0000-0000-000000000104'::UUID),
  ('00000000-0000-0000-0000-000000000203'::UUID, '00000000-0000-0000-0000-000000000105'::UUID),
  ('00000000-0000-0000-0000-000000000204'::UUID, '00000000-0000-0000-0000-000000000102'::UUID),
  ('00000000-0000-0000-0000-000000000204'::UUID, '00000000-0000-0000-0000-000000000109'::UUID),
  ('00000000-0000-0000-0000-000000000205'::UUID, '00000000-0000-0000-0000-000000000104'::UUID),
  ('00000000-0000-0000-0000-000000000205'::UUID, '00000000-0000-0000-0000-000000000110'::UUID),
  ('00000000-0000-0000-0000-000000000205'::UUID, '00000000-0000-0000-0000-000000000101'::UUID)
) AS v(p, u)
WHERE NOT EXISTS (
  SELECT 1 FROM post_likes l WHERE l.post_id = v.p AND l.user_id = v.u
);

-- ------------------------------------------------------------
-- 5. Comentários (triggers atualizam comments_count + notificações)
-- ------------------------------------------------------------

INSERT INTO post_comments (post_id, user_id, content, created_at, updated_at)
SELECT p, u, c, t, t
FROM (VALUES
  ('00000000-0000-0000-0000-000000000201'::UUID, '00000000-0000-0000-0000-000000000103'::UUID, 'Que energia dessa turma! Quero participar da próxima! 🪁'::TEXT, now() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000000000201'::UUID, '00000000-0000-0000-0000-000000000108'::UUID, 'Atalaia estava perfeita mesmo, água flat o dia todo!'::TEXT, now() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000000000203'::UUID, '00000000-0000-0000-0000-000000000105'::UUID, 'Nos vemos na largada! Barco de apoio garantido. 🏜️'::TEXT, now() - INTERVAL '10 hours'),
  ('00000000-0000-0000-0000-000000000204'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'Orgulho demais! Evolução absurda em 12 dias. 👏'::TEXT, now() - INTERVAL '18 hours'),
  ('00000000-0000-0000-0000-000000000205'::UUID, '00000000-0000-0000-0000-000000000110'::UUID, 'Já garanti minha vaga na travessia de junho!'::TEXT, now() - INTERVAL '26 hours')
) AS v(p, u, c, t)
WHERE NOT EXISTS (
  SELECT 1 FROM post_comments cc
  WHERE cc.post_id = v.p AND cc.user_id = v.u AND cc.content = v.c
);

-- ------------------------------------------------------------
-- 6. Conversas diretas + membros
-- ------------------------------------------------------------

INSERT INTO conversations (id, type, name, created_by, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000301', 'direct', 'Marina Vento', '00000000-0000-0000-0000-000000000102', now() - INTERVAL '2 days', now() - INTERVAL '25 minutes'),
  ('00000000-0000-0000-0000-000000000302', 'direct', 'João Fonseca', '00000000-0000-0000-0000-000000000101', now() - INTERVAL '3 days', now() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000000000303', 'direct', 'Luiza Kite', '00000000-0000-0000-0000-000000000106', now() - INTERVAL '4 days', now() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0000-000000000304', 'direct', 'Beatriz Sal', '00000000-0000-0000-0000-000000000110', now() - INTERVAL '5 days', now() - INTERVAL '30 hours')
ON CONFLICT (id) DO NOTHING;

INSERT INTO conversation_members (conversation_id, user_id, role)
SELECT c, u, r::member_role
FROM (VALUES
  ('00000000-0000-0000-0000-000000000301'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'owner'::TEXT),
  ('00000000-0000-0000-0000-000000000301'::UUID, '00000000-0000-0000-0000-000000000101'::UUID, 'member'::TEXT),
  ('00000000-0000-0000-0000-000000000302'::UUID, '00000000-0000-0000-0000-000000000101'::UUID, 'owner'::TEXT),
  ('00000000-0000-0000-0000-000000000302'::UUID, '00000000-0000-0000-0000-000000000103'::UUID, 'member'::TEXT),
  ('00000000-0000-0000-0000-000000000303'::UUID, '00000000-0000-0000-0000-000000000106'::UUID, 'owner'::TEXT),
  ('00000000-0000-0000-0000-000000000303'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'member'::TEXT),
  ('00000000-0000-0000-0000-000000000304'::UUID, '00000000-0000-0000-0000-000000000110'::UUID, 'owner'::TEXT),
  ('00000000-0000-0000-0000-000000000304'::UUID, '00000000-0000-0000-0000-000000000105'::UUID, 'member'::TEXT)
) AS v(c, u, r)
WHERE NOT EXISTS (
  SELECT 1 FROM conversation_members m
  WHERE m.conversation_id = v.c AND m.user_id = v.u
);

-- ------------------------------------------------------------
-- 7. Mensagens reais
-- ------------------------------------------------------------

INSERT INTO messages (conversation_id, sender_id, message_type, content, created_at, updated_at)
SELECT c, s, 'text'::message_type, m, t, t
FROM (VALUES
  ('00000000-0000-0000-0000-000000000301'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'Oi! Vi que você curtiu o post da aula de sábado!'::TEXT, now() - INTERVAL '95 minutes'),
  ('00000000-0000-0000-0000-000000000301'::UUID, '00000000-0000-0000-0000-000000000101'::UUID, 'Curti sim! Ainda tem vaga na turma das 9h?'::TEXT, now() - INTERVAL '88 minutes'),
  ('00000000-0000-0000-0000-000000000301'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'Tem sim! Vou te reservar. Traz protetor e água, o resto é comigo.'::TEXT, now() - INTERVAL '80 minutes'),
  ('00000000-0000-0000-0000-000000000301'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'Bora pro downwind de sábado? Vai ter barco de apoio!'::TEXT, now() - INTERVAL '25 minutes'),
  ('00000000-0000-0000-0000-000000000302'::UUID, '00000000-0000-0000-0000-000000000101'::UUID, 'Qual foi a média de vento na travessia de ontem?'::TEXT, now() - INTERVAL '150 minutes'),
  ('00000000-0000-0000-0000-000000000302'::UUID, '00000000-0000-0000-0000-000000000103'::UUID, 'Ficou entre 18 e 22 nós o dia todo. Água flat na maior parte!'::TEXT, now() - INTERVAL '140 minutes'),
  ('00000000-0000-0000-0000-000000000302'::UUID, '00000000-0000-0000-0000-000000000101'::UUID, 'As fotos da travessia ficaram insanas, te mandei no grupo'::TEXT, now() - INTERVAL '120 minutes'),
  ('00000000-0000-0000-0000-000000000303'::UUID, '00000000-0000-0000-0000-000000000106'::UUID, 'Consegui velejar sozinha hoje!!'::TEXT, now() - INTERVAL '300 minutes'),
  ('00000000-0000-0000-0000-000000000303'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'Aêêê! Sabia que ia rolar! Quando vamos comemorar com um downwind?'::TEXT, now() - INTERVAL '290 minutes'),
  ('00000000-0000-0000-0000-000000000304'::UUID, '00000000-0000-0000-0000-000000000110'::UUID, 'Me passa o contato do guia de Atins?'::TEXT, now() - INTERVAL '30 hours')
) AS v(c, s, m, t)
WHERE NOT EXISTS (
  SELECT 1 FROM messages mm
  WHERE mm.conversation_id = v.c AND mm.sender_id = v.s AND mm.content = v.m
);

-- ------------------------------------------------------------
-- 8. Trips georreferenciadas complementares
-- ------------------------------------------------------------

INSERT INTO trips (
  id, title, slug, description, destination,
  start_date, end_date, cover_url,
  status, visibility, max_participants, created_by,
  start_point, end_point, start_coords, end_coords,
  route_points, distance_km, estimated_duration, wind_condition,
  created_at, updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000401',
    'Alter do Chão → Ponta do Cururu — Downwind no Tapajós',
    'alter-do-chao-ponta-do-cururu-downwind',
    'Travessia clássica em água doce: 18km de downwind pelo Rio Tapajós, com botos, praias de areia branca e pôr do sol amazônico.',
    'Alter do Chão, Santarém — PA',
    CURRENT_DATE + 20, CURRENT_DATE + 21,
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
    'published', 'public', 8,
    '00000000-0000-0000-0000-000000000102',
    'Lago Verde, Alter do Chão (PA)',
    'Ponta do Cururu (PA)',
    '[-2.5083, -54.9461]'::jsonb,
    '[-2.5210, -54.9780]'::jsonb,
    '[
      {"lat": -2.5083, "lng": -54.9461, "name": "Largada: Lago Verde", "type": "start", "notes": "Água doce flat e vento térmico"},
      {"lat": -2.5150, "lng": -54.9620, "name": "Ilha do Amor", "type": "waypoint", "notes": "Parada para hidratação"},
      {"lat": -2.5210, "lng": -54.9780, "name": "Chegada: Ponta do Cururu", "type": "end", "notes": "Pôr do sol amazônico"}
    ]'::jsonb,
    18.0,
    '2h 00min',
    '{"direction": "E", "speed_min_kts": 14, "speed_max_kts": 20, "tide": "Cheia", "best_swell": "Flat"}'::jsonb,
    now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    'Atins → Caburé — Travessia dos Lençóis',
    'atins-cabure-travessia-dos-lencois',
    'Kite entre dunas brancas e lagoas esmeralda: a travessia mais fotogênica do Brasil, com apoio de barco e guia local.',
    'Lençóis Maranhenses, MA',
    CURRENT_DATE + 35, CURRENT_DATE + 36,
    'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
    'published', 'public', 10,
    '00000000-0000-0000-0000-000000000105',
    'Atins (MA)',
    'Caburé / Paulino Neves (MA)',
    '[-2.5710, -42.7480]'::jsonb,
    '[-2.6580, -42.6640]'::jsonb,
    '[
      {"lat": -2.5710, "lng": -42.7480, "name": "Largada: Atins", "type": "start", "notes": "Foz do Rio Preguiças"},
      {"lat": -2.6100, "lng": -42.7100, "name": "Boca da Barra", "type": "waypoint", "notes": "Transição mar/rio"},
      {"lat": -2.6580, "lng": -42.6640, "name": "Chegada: Caburé", "type": "end", "notes": "Península entre rio e mar"}
    ]'::jsonb,
    16.0,
    '1h 50min',
    '{"direction": "NE", "speed_min_kts": 18, "speed_max_kts": 25, "tide": "Secando", "best_swell": "Flat"}'::jsonb,
    now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000403',
    'Soure → Pesqueiro — Clássica do Marajó',
    'soure-pesqueiro-classica-do-marajo',
    'A rota selvagem do estuário amazônico: canal do Paracauari, botos cor-de-rosa e chegada na Praia do Pesqueiro.',
    'Ilha do Marajó, PA',
    CURRENT_DATE + 50, CURRENT_DATE + 52,
    'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=800&q=80',
    'published', 'public', 8,
    '00000000-0000-0000-0000-000000000102',
    'Soure - Canal do Rio Paracauari (PA)',
    'Praia do Pesqueiro - Marajó (PA)',
    '[-0.7250, -48.5150]'::jsonb,
    '[-0.6620, -48.4750]'::jsonb,
    '[
      {"lat": -0.7250, "lng": -48.5150, "name": "Largada: Soure", "type": "start", "notes": "Saída no canal com barco de apoio"},
      {"lat": -0.6900, "lng": -48.4900, "name": "Barra do Paracauari", "type": "waypoint", "notes": "Avistamento de botos"},
      {"lat": -0.6620, "lng": -48.4750, "name": "Chegada: Praia do Pesqueiro", "type": "end", "notes": "Culinária típica marajoara"}
    ]'::jsonb,
    22.0,
    '2h 15min',
    '{"direction": "E/SE", "speed_min_kts": 16, "speed_max_kts": 22, "tide": "Enchendo", "best_swell": "Flat"}'::jsonb,
    now(), now()
  )
ON CONFLICT (id) DO NOTHING;

-- Participantes das trips seed (organizadores + confirmados)
INSERT INTO trip_participants (trip_id, user_id, role, status)
SELECT t, u, r::trip_role, 'confirmed'::trip_member_status
FROM (VALUES
  ('00000000-0000-0000-0000-000000000401'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'organizer'::TEXT),
  ('00000000-0000-0000-0000-000000000401'::UUID, '00000000-0000-0000-0000-000000000101'::UUID, 'participant'::TEXT),
  ('00000000-0000-0000-0000-000000000401'::UUID, '00000000-0000-0000-0000-000000000108'::UUID, 'participant'::TEXT),
  ('00000000-0000-0000-0000-000000000402'::UUID, '00000000-0000-0000-0000-000000000105'::UUID, 'organizer'::TEXT),
  ('00000000-0000-0000-0000-000000000402'::UUID, '00000000-0000-0000-0000-000000000110'::UUID, 'participant'::TEXT),
  ('00000000-0000-0000-0000-000000000403'::UUID, '00000000-0000-0000-0000-000000000102'::UUID, 'organizer'::TEXT),
  ('00000000-0000-0000-0000-000000000403'::UUID, '00000000-0000-0000-0000-000000000103'::UUID, 'participant'::TEXT)
) AS v(t, u, r)
WHERE NOT EXISTS (
  SELECT 1 FROM trip_participants p WHERE p.trip_id = v.t AND p.user_id = v.u
);
