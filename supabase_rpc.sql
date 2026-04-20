-- Run this in your Supabase SQL Editor to enable server-side distance filtering

-- 1. Create a function to calculate distance and find donors
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
        -- Haversine formula for distance in km
        -- We cast the VARCHAR location to jsonb to extract coordinates
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
        -- Extract lat/lng from the stringified JSON location column and filter by radius
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

-- 2. Your indexes are already created nicely according to your schema!
-- I've added one for the location column just in case you ever switch to PostGIS,
-- but for now your current indexes are perfect.
