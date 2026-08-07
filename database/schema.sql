CREATE DATABASE IF NOT EXISTS blog_management_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blog_management_system;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'GENERAL_USER') NOT NULL DEFAULT 'GENERAL_USER',
  status ENUM('PENDING', 'ACTIVE') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_unique (username),
  UNIQUE KEY users_email_unique (email)
);

CREATE TABLE IF NOT EXISTS blogs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY blogs_user_id_index (user_id),
  CONSTRAINT blogs_user_id_foreign
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  blog_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY comments_blog_id_index (blog_id),
  KEY comments_user_id_index (user_id),
  CONSTRAINT comments_blog_id_foreign
    FOREIGN KEY (blog_id) REFERENCES blogs(id)
    ON DELETE CASCADE,
  CONSTRAINT comments_user_id_foreign
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  blog_id INT UNSIGNED NOT NULL,
  comment_id INT UNSIGNED NOT NULL,
  message VARCHAR(255) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY notifications_user_id_index (user_id),
  KEY notifications_blog_id_index (blog_id),
  KEY notifications_comment_id_index (comment_id),
  CONSTRAINT notifications_user_id_foreign
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,
  CONSTRAINT notifications_blog_id_foreign
    FOREIGN KEY (blog_id) REFERENCES blogs(id)
    ON DELETE CASCADE,
  CONSTRAINT notifications_comment_id_foreign
    FOREIGN KEY (comment_id) REFERENCES comments(id)
    ON DELETE CASCADE
);


INSERT INTO users (username, email, password, role, status)
VALUES (
  'fluke123',
  'fluke@test.com',
  '$2b$10$rEA4DgWtxs28.jWFVbDi2.5OWFMkavEHcxKnbbL180dioLudwviSy',
  'SUPER_ADMIN',
  'ACTIVE'
)
ON DUPLICATE KEY UPDATE
  role = VALUES(role),
  status = VALUES(status);
