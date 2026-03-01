-- Run these commands in phpMyAdmin or through your SQL terminal
-- to allow seamless OAuth logins.

-- 1. Make the password column optional since OAuth users don't have one
ALTER TABLE users MODIFY password VARCHAR(255) NULL;

-- 2. Add columns to track where the user came from
ALTER TABLE users ADD COLUMN auth_provider ENUM('local', 'google', 'apple', 'github') DEFAULT 'local' AFTER password;
ALTER TABLE users ADD COLUMN provider_id VARCHAR(255) NULL AFTER auth_provider;
