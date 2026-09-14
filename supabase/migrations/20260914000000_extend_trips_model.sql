-- ============================================================
-- FASE 17: Extend Trip Model + RLS Fix for Anon + Seed Data
-- ============================================================

-- ============================================================
-- 1. EXTEND TRIPS TABLE — new content fields
-- ============================================================

ALTER TABLE trips ADD COLUMN IF NOT EXISTS body_text      TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS gallery_urls   TEXT[]        NOT NULL DEFAULT '{}';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS video_url      TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS schedule       JSONB         NOT NULL DEFAULT '[]';

-- ============================================================
-- 2. FIX RLS — allow anon to read public published trips
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can view published trips" ON trips;
DROP POLICY IF EXISTS "Public can view published public trips"       ON trips;

CREATE POLICY "Public can view published public trips"
  ON trips FOR SELECT
  USING (
    (visibility = 'public' AND status = 'published')
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM trip_participants tp
      WHERE tp.trip_id = trips.id AND tp.user_id = auth.uid()
    )
  );

-- ============================================================
-- 3. SEED — 4 demonstration trips
-- ============================================================

DO $$
DECLARE
  v_org_id UUID := '00000000-0000-0000-0000-000000000001';
  v_trip1   UUID;
  v_trip2   UUID;
  v_trip3   UUID;
  v_trip4   UUID;
BEGIN
  IF EXISTS (SELECT 1 FROM trips LIMIT 1) THEN
    RAISE NOTICE 'Trips already seeded — skipping.';
    RETURN;
  END IF;

  INSERT INTO auth.users (
    id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, aud, role
  )
  VALUES (
    v_org_id,
    'demo-organizer@amzwind.com.br',
    crypt('DemoPass123!', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Amazon Wind"}',
    'authenticated', 'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO profiles (id, full_name, avatar_url, role, created_at, updated_at)
  VALUES (v_org_id, 'Amazon Wind', null, 'admin', now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- Trip 1
  INSERT INTO trips (
    title, slug, description, body_text,
    destination, start_date, end_date,
    cover_url, gallery_urls, status, visibility, max_participants,
    created_by, schedule, created_at, updated_at
  ) VALUES (
    'Kite Camp Preá — Temporada dos Ventos',
    'kite-camp-prea-temporada-dos-ventos',
    'Viva a temporada de kitesurf mais intensa do Nordeste. Preá, no Ceará, é o coração dos ventos do Brasil: constante, fresco e com spot incomparável para todos os níveis.',
    'O Preá é um dos spots de kite mais famosos do mundo — e por um bom motivo. O vento chega a 25 nós todos os dias, as lagoas de água doce são perfeitas para iniciantes e o mar aberto oferece surf e manobras para os mais avançados. Nesta trip você terá sessões guiadas de manhã e tarde, tempo livre para explorar a vila, e encontros ao pôr do sol com outros riders. Acomodação em pousada parceira a 200m do spot, incluída no pacote.',
    'Preá, Ceará — Brasil',
    (now() + interval ''45 days'')::date,
    (now() + interval ''52 days'')::date,
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    ],
    'published', 'public', 12,
    v_org_id,
    '[{"day":1,"title":"Chegada e Check-in","description":"Recepção no aeroporto de Fortaleza, transfer para Preá, jantar de boas-vindas."},{"day":2,"title":"Primeira Sessão","description":"Manhã: avaliação de nível e sessão guiada na lagoa. Tarde: kite no mar com instrutor."},{"day":3,"title":"Downwind Lagoas","description":"Rota de downwind entre as lagoas de Tatajuba — 2h de pura adrenalina."},{"day":4,"title":"Dia Livre + Sunset","description":"Sessão livre no spot favorito, happy hour com riders de todo o Brasil."},{"day":5,"title":"Encerramento","description":"Sessão de fotos e vídeo, almoço de despedida, transfer de volta."}]'::jsonb,
    now(), now()
  ) RETURNING id INTO v_trip1;

  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (v_trip1, v_org_id, 'organizer', 'confirmed') ON CONFLICT DO NOTHING;

  -- Trip 2
  INSERT INTO trips (
    title, slug, description, body_text,
    destination, start_date, end_date,
    cover_url, gallery_urls, status, visibility, max_participants,
    created_by, schedule, created_at, updated_at
  ) VALUES (
    'Downwind Marajó — Expedição Amazônica',
    'downwind-marajo-expedicao-amazonica',
    'A rota de downwind mais selvagem do Brasil: pelo estuário do Amazonas, com golfinhos cor-de-rosa, igarapés e pôr do sol dourado sobre o Marajó.',
    'A Ilha do Marajó tem mais de 49.000 km² e abriga uma das concentrações mais impressionantes de fauna aquática do planeta. Nossa rota de downwind percorre o canal entre Soure e a costa atlântica, aproveitando o vento alísio constante de E/SE. Águas rasas e quentes, sem ondas, com visibilidade de fundo. Nos intervalos, paramos em praias desertas e igarapés cristalinos. Uma expedição que mistura esporte, natureza e cultura ribeirinha.',
    'Ilha do Marajó, Pará — Brasil',
    (now() + interval ''30 days'')::date,
    (now() + interval ''34 days'')::date,
    'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=800&q=80',
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
      'https://images.unsplash.com/photo-1591170498521-4e1cfaf72ffe?w=800&q=80'
    ],
    'published', 'public', 8,
    v_org_id,
    '[{"day":1,"title":"Belém → Soure","description":"Voo para Belém, barco até Soure. Check-in na pousada e briefing da expedição."},{"day":2,"title":"Downwind Principal","description":"Rota Soure > Pesqueiro (22km). Vento constante, golfinhos cor-de-rosa no canal."},{"day":3,"title":"Igarapés e Natureza","description":"Kayak pelos igarapés, trilha para ver búfalos e aves. Sessão de kite ao entardecer."},{"day":4,"title":"Retorno","description":"Última sessão matinal, almoço típico do Marajó, barco de volta a Belém."}]'::jsonb,
    now(), now()
  ) RETURNING id INTO v_trip2;

  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (v_trip2, v_org_id, 'organizer', 'confirmed') ON CONFLICT DO NOTHING;

  -- Trip 3
  INSERT INTO trips (
    title, slug, description, body_text,
    destination, start_date, end_date,
    cover_url, gallery_urls, status, visibility, max_participants,
    created_by, schedule, created_at, updated_at
  ) VALUES (
    'Lençóis Maranhenses — Travessia dos Ventos',
    'lencois-maranhenses-travessia-dos-ventos',
    'Kite entre as dunas dos Lençóis Maranhenses, com lagoas azuis e turquesas. Uma das paisagens mais únicas do planeta.',
    'Os Lençóis Maranhenses são um dos lugares mais surreais do Brasil: dunas brancas que se estendem por centenas de quilômetros, intercaladas com lagoas de água doce de cor esmeralda e turquesa. No período certo (maio a setembro), essas lagoas estão cheias e o vento alísio está na sua melhor forma — condições perfeitas para body drag, kite leve e sessões de fotos cinematográficas.',
    'Lençóis Maranhenses, Maranhão — Brasil',
    (now() + interval ''60 days'')::date,
    (now() + interval ''65 days'')::date,
    'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80'
    ],
    'published', 'public', 10,
    v_org_id,
    '[{"day":1,"title":"São Luís → Barreirinhas","description":"Voo para São Luís, traslado até Barreirinhas. Jantar e briefing."},{"day":2,"title":"Lagoa Azul e Lagoa Bonita","description":"Trekking/kite até as lagoas mais famosas. Sessão de fotos ao meio-dia."},{"day":3,"title":"Travessia das Dunas","description":"Kite body drag nas dunas, chegada até Lagoa Esperança."},{"day":4,"title":"Lagoa Preta e Retorno","description":"Aurora sobre as dunas. Kite matinal. Retorno a Barreirinhas."},{"day":5,"title":"Volta","description":"Transfer para São Luís, flight de retorno."}]'::jsonb,
    now(), now()
  ) RETURNING id INTO v_trip3;

  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (v_trip3, v_org_id, 'organizer', 'confirmed') ON CONFLICT DO NOTHING;

  -- Trip 4
  INSERT INTO trips (
    title, slug, description, body_text,
    destination, start_date, end_date,
    cover_url, gallery_urls, status, visibility, max_participants,
    created_by, schedule, created_at, updated_at
  ) VALUES (
    'Salinas → Marieta — Premium Coastal Run',
    'salinas-marieta-premium-coastal-run',
    'A rota de downwind mais exclusiva do litoral norte. 6 horas de navegação contínua entre Salinas e Marieta, com vento alísio e águas azuis-turquesa.',
    'Esta é a trip flagship da Amazon Wind. A rota entre Salinas e a Ilha de Marieta é longa, exigente e absolutamente espetacular: costões rochosos, praias de areia branca que só aparecem na maré baixa, e vento constante de 20 a 28 nós durante toda a travessia. Você vai acompanhado por nosso barco de suporte, com equipe de filmagem e fotografia a bordo. No final do dia, almoço premium com frutos do mar na praia de Marieta.',
    'Salinas — Marieta, Pará — Brasil',
    (now() + interval ''15 days'')::date,
    (now() + interval ''16 days'')::date,
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    ARRAY[
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80'
    ],
    'published', 'public', 6,
    v_org_id,
    '[{"day":1,"title":"Briefing e Preparação","description":"Encontro em Salinas às 7h. Check de equipamentos, briefing meteorológico."},{"day":1,"title":"Largada às 9h","description":"Saída de Salinas com vento alísio. Primeira parada em praia isolada após 15km."},{"day":1,"title":"Chegada a Marieta (15h)","description":"Arrival em Marieta. Almoço premium com frutos do mar locais."},{"day":2,"title":"Sessão Bônus","description":"Kite matinal em Marieta antes do retorno."}]'::jsonb,
    now(), now()
  ) RETURNING id INTO v_trip4;

  INSERT INTO trip_participants (trip_id, user_id, role, status)
  VALUES (v_trip4, v_org_id, 'organizer', 'confirmed') ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Trips seed concluído: 4 trips inseridas.';
END $$;
