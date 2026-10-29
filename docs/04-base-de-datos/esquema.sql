-- FutStore · esquema de base de datos (PostgreSQL)

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(40)  NOT NULL UNIQUE,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  picture       TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE rarities (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(30) NOT NULL UNIQUE,
  color VARCHAR(7)  NOT NULL
);

CREATE TABLE cards (
  id          SERIAL PRIMARY KEY,
  rarity_id   INT NOT NULL REFERENCES rarities(id),
  player_name VARCHAR(80) NOT NULL,
  position    VARCHAR(5)  NOT NULL,
  club        VARCHAR(60),
  nation      VARCHAR(60),
  overall     SMALLINT NOT NULL CHECK (overall BETWEEN 1 AND 99),
  pace        SMALLINT, shooting  SMALLINT, passing  SMALLINT,
  dribbling   SMALLINT, defending SMALLINT, physical SMALLINT,
  image_url   TEXT
);

CREATE TABLE posts (
  id          SERIAL PRIMARY KEY,
  seller_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id     INT NOT NULL REFERENCES cards(id),
  title       VARCHAR(120) NOT NULL,
  description TEXT,
  price       INTEGER NOT NULL CHECK (price > 0),
  status      VARCHAR(12) NOT NULL DEFAULT 'available'
              CHECK (status IN ('available', 'paused', 'sold')),
  image_url   TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE favorites (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id    INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, post_id)
);

CREATE TABLE messages (
  id         SERIAL PRIMARY KEY,
  post_id    INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  sender_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_seller ON posts(seller_id);
CREATE INDEX idx_posts_card   ON posts(card_id);
CREATE INDEX idx_messages_post ON messages(post_id);
