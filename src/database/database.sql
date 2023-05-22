-- Active: 1683998071245@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT(DATETIME('now'))
);

INSERT INTO users(id, name, email, password, role)
VALUES
-- u001 senha: 123456
    ('u001', 'Jose da Silva', 'joses@hotmail.com', '$2y$12$LRBCJeLN2YKXKalo.azLSOk8l0Y7PaPjXlYGNmYyAbROAUKUUZrMm', 'NORMAL'),
-- u002 senha: 321654
    ('u002', 'Matheus dos Santos', 'matheussan@gmail.com', '$2y$12$Wp9TS6ffv7qiAkWtstlKZOcXbA85L7RrXSagBJhmDqYkA97RSKkjC', 'ADMIN'),
-- u003 senha: 147258
    ('u003', 'Joana Batista', 'joanabat@yahoo.com.br', '$2y$12$v4vuTDg/ewRvfX9cqSgwrO34tOdob4IIKjC3ju5tDhQ3/kIWI4XA.', 'NORMAL'),
-- u004 senha: 963852
    ('u004', 'Vilma Souza', 'vilmasou@outlook.com', '$2y$12$4wTl8rUoyfLIt3NZTz0sMewuny1VJP.BN0iMe7bBGWADbt.V5NvQ.', 'NORMAL');

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    comments INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now')),
    updated_at TEXT,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO posts(id, creator_id, content)
VALUES
    ('p001', 'u001', 'Fim de semana com a familia.'),
    ('p002', 'u002', 'Viagem a trabalho.'),
    ('p003', 'u003', 'Passeio Cordilheira dos Andes.'),
    ('p004', 'u004', 'Jantar com os amigos.'),
    ('p005', 'u002', 'Visitando meus tios.'),
    ('p006', 'u004', 'Aniversario do meu pai.');

CREATE TABLE posts_likes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE comments(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL,
    dislikes INTEGER DEFAULT(0) NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now')),
    updated_at TEXT,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE 
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE 
);


INSERT INTO comments(id, creator_id, post_id, content)
VALUES
    ('c001', 'u004', 'p001', 'Shooow.'),
    ('c002', 'u003', 'p002', 'lol.'),
    ('c003', 'u002', 'p003', 'Legal!!.'),
    ('c004', 'u001', 'p004', 'Bora!.'),
    ('c005', 'u004', 'p005', '<3 <3 <3.'),
    ('c006', 'u001', 'p006', 'Partiu!.');

CREATE TABLE comments_likes(
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

DROP TABLE users;

DROP TABLE posts;

DROP TABLE posts_likes;

DROP TABLE comments;

DROP TABLE comments_likes;

SELECT COUNT(*) FROM comments WHERE(post_id = 'p004');