-- Run this in your Supabase SQL Editor to create the missing hospitals table

CREATE TABLE hospitals (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  blood_types VARCHAR(255), -- Comma separated list of blood types available
  verified BOOLEAN DEFAULT false,
  emergency_24h BOOLEAN DEFAULT false,
  blood_bank BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster filtering and searching
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_verified ON hospitals(verified);
CREATE INDEX idx_hospitals_emergency ON hospitals(emergency_24h);
CREATE INDEX idx_hospitals_blood_bank ON hospitals(blood_bank);

-- Insert some dummy data so the page isn't empty (Optional)
INSERT INTO hospitals (name, address, city, phone, email, blood_types, verified, emergency_24h, blood_bank) VALUES
('City General Hospital', '123 Main St, Downtown', 'Karachi', '+92 300 1234567', 'contact@citygeneral.pk', 'A+, O+, B-', true, true, true),
('National Blood Center', '45 Medical Center Blvd', 'Lahore', '+92 321 7654321', 'info@nationalblood.pk', 'A+, A-, B+, B-, O+, O-, AB+, AB-', true, false, true),
('Care Clinic & Trauma', '789 East Avenue', 'Islamabad', '+92 333 9876543', 'admin@careclinic.pk', 'A+, O+', false, true, false);
