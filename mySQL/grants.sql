-- Ensure the development database exists and admin user has full privileges
CREATE DATABASE IF NOT EXISTS `penguin_inspections` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY '1mK^Hm:tGpZ60g?v0mD7dQ';
GRANT ALL PRIVILEGES ON `penguin_inspections`.* TO 'admin'@'%';
FLUSH PRIVILEGES;
