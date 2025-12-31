-- Создание таблиц для системы кинотеатра

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заказов билетов
CREATE TABLE IF NOT EXISTS ticket_orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    movie_title VARCHAR(255) NOT NULL,
    seats JSONB NOT NULL,
    total_price INTEGER NOT NULL,
    session_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица заказов товаров
CREATE TABLE IF NOT EXISTS product_orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ticket_order_id INTEGER,
    products JSONB NOT NULL,
    total_price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица друзей
CREATE TABLE IF NOT EXISTS friendships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, friend_id)
);

-- Таблица сообщений
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    difficulty VARCHAR(10) NOT NULL,
    review_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_ticket_orders_user_id ON ticket_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_product_orders_user_id ON product_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);