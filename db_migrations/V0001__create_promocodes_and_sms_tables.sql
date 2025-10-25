CREATE TABLE promocodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    country_code VARCHAR(10),
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE sms_messages (
    id SERIAL PRIMARY KEY,
    promocode_id INTEGER REFERENCES promocodes(id),
    phone_number VARCHAR(20) NOT NULL,
    message_body TEXT NOT NULL,
    from_number VARCHAR(20),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promocodes_code ON promocodes(code);
CREATE INDEX idx_promocodes_is_used ON promocodes(is_used);
CREATE INDEX idx_sms_promocode_id ON sms_messages(promocode_id);