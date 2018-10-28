# mysql -u root -p password
CREATE USER 'wenping'@'%' IDENTIFIED WITH mysql_native_password BY 'Password1';
create database wenping default character set utf8mb4 collate utf8mb4_unicode_ci;
GRANT all ON wenping.* TO 'wenping'@'%';

