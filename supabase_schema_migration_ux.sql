-- Bloodzy UX schema alignment migration
-- Run this in Supabase SQL editor after taking a backup.

BEGIN;

-- 1) Donors: support fast donor listing without extra joins.
ALTER TABLE donors
  ADD COLUMN IF NOT EXISTS name VARCHAR(100);

UPDATE donors
SET name = 'Donor'
WHERE name IS NULL OR btrim(name) = '';

ALTER TABLE donors
  ALTER COLUMN name SET DEFAULT 'Donor';

ALTER TABLE donors
  ALTER COLUMN name SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_donors_name ON donors(name);

-- 2) Blood requests: allow emergency requests without account friction.
ALTER TABLE blood_requests
  ALTER COLUMN user_id DROP NOT NULL,
  ALTER COLUMN patient_name DROP NOT NULL,
  ALTER COLUMN hospital DROP NOT NULL,
  ALTER COLUMN contact_email DROP NOT NULL,
  ALTER COLUMN units SET DEFAULT 1,
  ALTER COLUMN urgency SET DEFAULT 'urgent';

ALTER TABLE blood_requests
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT false;

UPDATE blood_requests
SET is_anonymous = (user_id IS NULL)
WHERE is_anonymous IS DISTINCT FROM (user_id IS NULL);

CREATE INDEX IF NOT EXISTS idx_blood_requests_is_anonymous ON blood_requests(is_anonymous);

-- 3) Optional hospital location support for future distance UX.
ALTER TABLE hospitals
  ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- 4) Refresh distance RPC to include donor name in the result payload.
CREATE OR REPLACE FUNCTION search_donors_by_distance(
    search_blood_group text,
    search_city text,
    search_lat float,
    search_lng float,
    radius_km float,
    max_limit int DEFAULT 50
)
RETURNS TABLE (
    id bigint,
    user_id uuid,
    name varchar,
    blood_group varchar,
    age integer,
    gender varchar,
    phone varchar,
    city varchar,
    available boolean,
    location varchar,
    created_at timestamptz,
    distance_km float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.user_id,
        d.name,
        d.blood_group,
        d.age,
        d.gender,
        d.phone,
        d.city,
        d.available,
        d.location,
        d.created_at,
        (
            6371 * acos(
                cos(radians(search_lat)) * cos(radians(((d.location::jsonb)->'coordinates'->>1)::float)) *
                cos(radians(((d.location::jsonb)->'coordinates'->>0)::float) - radians(search_lng)) +
                sin(radians(search_lat)) * sin(radians(((d.location::jsonb)->'coordinates'->>1)::float))
            )
        ) AS distance_km
    FROM donors d
    WHERE
        (search_blood_group IS NULL OR d.blood_group = search_blood_group)
        AND (search_city IS NULL OR d.city ILIKE '%' || search_city || '%')
        AND d.location IS NOT NULL
        AND d.location != ''
        AND (
            6371 * acos(
                cos(radians(search_lat)) * cos(radians(((d.location::jsonb)->'coordinates'->>1)::float)) *
                cos(radians(((d.location::jsonb)->'coordinates'->>0)::float) - radians(search_lng)) +
                sin(radians(search_lat)) * sin(radians(((d.location::jsonb)->'coordinates'->>1)::float))
            )
        ) <= radius_km
    ORDER BY distance_km ASC
    LIMIT max_limit;
END;
$$;

COMMIT;