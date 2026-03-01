-- Instructions for phpMyAdmin:
-- Run this to create a Demo User for testing the standard User Dashboard

INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) 
VALUES (
    'Demo User', 
    'demo@creative4ai.com', 
    '$2y$10$tZ2E1k2T7y1V0I.f.b2Q7.Q1zW1yH8R0J6L0vK9qY5R5P5B5M5O5O', 
    'user',
    'active'
);

-- NOTE: The password hash above is the bcrypt equivalent of "Password123!"
-- You can log in using:
-- Email: demo@creative4ai.com
-- Password: Password123!
