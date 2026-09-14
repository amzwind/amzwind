-- ============================================================
-- Migration: 20260914030000_geo_trips_and_get_trip_rpc.sql
-- Description: Extend trips with geolocation & downwind route data
--              and implement/fix get_trip RPC for TripDetailPage
-- ============================================================

-- 1. EXTEND TRIPS TABLE WITH GEOLOCATION & DOWNWIND FIELDS
ALTER TABLE trips ADD COLUMN IF NOT EXISTS start_point        TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS end_point          TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS start_coords       JSONB;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS end_coords         JSONB;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS route_points       JSONB NOT NULL DEFAULT '[]';
ALTER TABLE trips ADD COLUMN IF NOT EXISTS distance_km        NUMERIC(6,2) DEFAULT 0;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS estimated_duration TEXT;
ALTER TABLE trips ADD COLUMN IF NOT EXISTS wind_condition     JSONB NOT NULL DEFAULT '{"direction": "NE", "speed_min_kts": 18, "speed_max_kts": 25, "tide": "Secando", "best_swell": "1.0m"}'::jsonb;

-- 2. CREATE OR REPLACE FUNCTION get_trip(p_trip_id UUID)
-- Guarantees full contract for TripDetailPage.tsx with all rich fields
CREATE OR REPLACE FUNCTION get_trip(p_trip_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  body_text TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  cover_url TEXT,
  gallery_urls TEXT[],
  video_url TEXT,
  schedule JSONB,
  status trip_status,
  visibility trip_visibility,
  max_participants INT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  start_point TEXT,
  end_point TEXT,
  start_coords JSONB,
  end_coords JSONB,
  route_points JSONB,
  distance_km NUMERIC,
  estimated_duration TEXT,
  wind_condition JSONB,
  participant_count BIGINT,
  is_participant BOOLEAN,
  creator_name TEXT,
  creator_avatar TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id,
    t.title,
    t.slug,
    t.description,
    t.body_text,
    t.destination,
    t.start_date,
    t.end_date,
    t.cover_url,
    t.gallery_urls,
    t.video_url,
    t.schedule,
    t.status,
    t.visibility,
    t.max_participants,
    t.created_by,
    t.created_at,
    t.updated_at,
    t.start_point,
    t.end_point,
    t.start_coords,
    t.end_coords,
    t.route_points,
    t.distance_km,
    t.estimated_duration,
    t.wind_condition,
    (SELECT count(*) FROM trip_participants tp WHERE tp.trip_id = t.id AND tp.status = 'confirmed') AS participant_count,
    EXISTS(
      SELECT 1
      FROM trip_participants tp
      WHERE tp.trip_id = t.id
        AND tp.user_id = auth.uid()
        AND tp.status = 'confirmed'
    ) AS is_participant,
    p.full_name AS creator_name,
    p.avatar_url AS creator_avatar
  FROM trips t
  LEFT JOIN profiles p ON p.id = t.created_by
  WHERE t.id = p_trip_id
    AND (
      t.visibility = 'public'
      OR t.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM trip_participants tp
        WHERE tp.trip_id = t.id
          AND tp.user_id = auth.uid()
          AND tp.status = 'confirmed'
      )
    );
$$;

-- Grant execution to authenticated and anon users
GRANT EXECUTE ON FUNCTION get_trip(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_trip(UUID) TO anon;

-- 3. UPDATE EXISTING TRIPS WITH DOWNWIND ROUTE COORDINATES (IF ANY SEEDED)
UPDATE trips
SET 
  start_point = 'Praia do Farol Velho, Salinas (PA)',
  end_point = 'Ilha da Marieta (PA)',
  start_coords = '[-0.602, -47.356]'::jsonb,
  end_coords = '[-0.591, -47.319]'::jsonb,
  distance_km = 38.5,
  estimated_duration = '3h 30min',
  wind_condition = '{"direction": "NE", "speed_min_kts": 20, "speed_max_kts": 28, "tide": "Vazante", "best_swell": "1.2m"}'::jsonb,
  route_points = '[
    {"lat": -0.6020, "lng": -47.3560, "name": "Largada: Farol Velho", "type": "start", "notes": "Decolagem e suporte de praia"},
    {"lat": -0.5965, "lng": -47.3380, "name": "Praia do Atalaia", "type": "waypoint", "notes": "Ponto de apoio e hidratação"},
    {"lat": -0.5940, "lng": -47.3290, "name": "Canal da Marieta", "type": "waypoint", "notes": "Água flat na maré seca"},
    {"lat": -0.5910, "lng": -47.3190, "name": "Chegada: Ilha de Marieta", "type": "end", "notes": "Almoço de confraternização"}
  ]'::jsonb
WHERE slug LIKE '%salinas%' OR title ILIKE '%salinas%';

UPDATE trips
SET 
  start_point = 'Soure - Canal do Rio Paracauari (PA)',
  end_point = 'Praia do Pesqueiro - Marajó (PA)',
  start_coords = '[-0.725, -48.515]'::jsonb,
  end_coords = '[-0.662, -48.475]'::jsonb,
  distance_km = 22.0,
  estimated_duration = '2h 15min',
  wind_condition = '{"direction": "E/SE", "speed_min_kts": 16, "speed_max_kts": 22, "tide": "Enchendo", "best_swell": "Flat"}'::jsonb,
  route_points = '[
    {"lat": -0.7250, "lng": -48.5150, "name": "Largada: Soure", "type": "start", "notes": "Saída no canal com barco de apoio"},
    {"lat": -0.6900, "lng": -48.4900, "name": "Barra do Paracauari", "type": "waypoint", "notes": "Área de golfinhos cor-de-rosa"},
    {"lat": -0.6620, "lng": -48.4750, "name": "Chegada: Praia do Pesqueiro", "type": "end", "notes": "Dunas e culinária típica marajoara"}
  ]'::jsonb
WHERE slug LIKE '%marajo%' OR title ILIKE '%marajó%';

UPDATE trips
SET 
  start_point = 'Praia do Preá (CE)',
  end_point = 'Lagoa de Tatajuba (CE)',
  start_coords = '[-2.812, -40.420]'::jsonb,
  end_coords = '[-2.871, -40.575]'::jsonb,
  distance_km = 28.0,
  estimated_duration = '2h 45min',
  wind_condition = '{"direction": "E", "speed_min_kts": 22, "speed_max_kts": 30, "tide": "Média", "best_swell": "1.5m"}'::jsonb,
  route_points = '[
    {"lat": -2.8120, "lng": -40.4200, "name": "Largada: Preá", "type": "start", "notes": "Vento forte constante e mar aberto"},
    {"lat": -2.7960, "lng": -40.5130, "name": "Jericoacoara (Ponta da Igreja)", "type": "waypoint", "notes": "Contorno do Parque Nacional"},
    {"lat": -2.8350, "lng": -40.5500, "name": "Guriú", "type": "waypoint", "notes": "Manguezal e apoio de balsa"},
    {"lat": -2.8710, "lng": -40.5750, "name": "Chegada: Tatajuba", "type": "end", "notes": "Água doce flat e redes na lagoa"}
  ]'::jsonb
WHERE slug LIKE '%prea%' OR title ILIKE '%preá%';
