CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS calendar;

CREATE TABLE calendar.events (
	event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL, -- REFERENCES tenants.users(user_id) <~ add this after adding users table
	title VARCHAR(255) NOT NULL,
	location VARCHAR(255),
	start_time TIMESTAMPTZ NOT NULL,
	end_time TIMESTAMPTZ NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION calendar.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON calendar.events
FOR EACH ROW
EXECUTE FUNCTION calendar.update_updated_at_column();