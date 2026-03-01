-- SaaS Platform Users (Admins and standard SaaS Users)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- End Users (App Users) who interact with specific workflows created by SaaS Users
CREATE TABLE IF NOT EXISTS app_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT NOT NULL,     -- The workflow they are engaging with
    saas_user_id INT NOT NULL,    -- The SaaS user who owns the workflow
    end_user_identifier VARCHAR(255), -- E.g., email or session ID of the app user
    interaction_data JSON,        -- Any stats/info about their interaction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    FOREIGN KEY (saas_user_id) REFERENCES users(id) ON DELETE CASCADE
);
