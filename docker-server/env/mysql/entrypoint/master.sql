CREATE DATABASE `apartment_master` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'master'@'%' IDENTIFIED BY 'master';
GRANT ALL PRIVILEGES ON apartment_master.* TO 'master'@'%';
