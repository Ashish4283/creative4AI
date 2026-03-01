-- 1. Update the table to accept all 4 role types
ALTER TABLE `users` MODIFY COLUMN `role` ENUM('admin', 'user', 'manager', 'worker') DEFAULT 'user';

-- 2. Fix your Demo User (who got a blank role in the screenshot)
UPDATE `users` SET `role` = 'user' WHERE `email` = 'demo@creative4ai.com';

-- 3. Insert the Manager and the Worker accounts
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) 
VALUES 
    ('App Manager', 'manager@creative4ai.com', '$2y$10$tZ2E1k2T7y1V0I.f.b2Q7.Q1zW1yH8R0J6L0vK9qY5R5P5B5M5O5O', 'manager', 'active'),
    ('Operational Worker', 'worker@creative4ai.com', '$2y$10$tZ2E1k2T7y1V0I.f.b2Q7.Q1zW1yH8R0J6L0vK9qY5R5P5B5M5O5O', 'worker', 'active');
