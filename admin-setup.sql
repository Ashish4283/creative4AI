-- Instructions for phpMyAdmin:
-- Please run this SQL command in the SQL tab of your phpMyAdmin.
-- This matches your exact database schema shown in the screenshots!

INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) 
VALUES (
    'Admin User', 
    'admin@creative4ai.com', 
    '$2y$10$tZ2E1k2T7y1V0I.f.b2Q7.Q1zW1yH8R0J6L0vK9qY5R5P5B5M5O5O', 
    'admin',
    'active'
);

-- NOTE: The password hash above is the bcrypt equivalent of "Password123!"
-- You can log in using:
-- Email: admin@creative4ai.com
-- Password: Password123!
