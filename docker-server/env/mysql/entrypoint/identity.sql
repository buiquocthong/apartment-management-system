CREATE DATABASE `apartment_identity` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'identity'@'%' IDENTIFIED BY 'identity';
GRANT ALL PRIVILEGES ON apartment_identity.* TO 'identity'@'%';
