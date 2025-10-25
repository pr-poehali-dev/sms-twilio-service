-- Создание таблицы для хранения виртуальных номеров Fanytel
CREATE TABLE IF NOT EXISTS fanytel_numbers (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    country_code VARCHAR(3) NOT NULL DEFAULT 'GB',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    notes TEXT
);

-- Создание таблицы для хранения промокодов
CREATE TABLE IF NOT EXISTS promocodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    country_code VARCHAR(3) NOT NULL DEFAULT 'GB',
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP,
    expires_at TIMESTAMP
);

-- Создание таблицы для хранения SMS сообщений
CREATE TABLE IF NOT EXISTS sms_messages (
    id SERIAL PRIMARY KEY,
    promocode_id INTEGER,
    phone_number VARCHAR(20) NOT NULL,
    from_number VARCHAR(50),
    message_body TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_promocodes_code ON promocodes(code);
CREATE INDEX IF NOT EXISTS idx_promocodes_phone ON promocodes(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_promocode ON sms_messages(promocode_id);
CREATE INDEX IF NOT EXISTS idx_sms_received ON sms_messages(received_at DESC);