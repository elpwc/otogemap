CREATE DATABASE IF NOT EXISTS `otogemap` DEFAULT CHARSET UTF8MB4;

CREATE TABLE IF NOT EXISTS `store`(
	`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(8) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `desc` VARCHAR(1024),
    `address` VARCHAR(1024),
    `mapURL` VARCHAR(1024),
    `adminlv1` VARCHAR(100),
    `adminlv2` VARCHAR(100),
    `adminlv3` VARCHAR(100),
    `adminlv4` VARCHAR(100),
    `adminlv5` VARCHAR(100),
    `arcade_amount` INT,
    `business_hours_start` INT,
    `business_minute_start` INT,
    `business_hours_end` INT,
    `business_minute_end` INT,
    `lng` DOUBLE NOT NULL,
    `lat` DOUBLE NOT NULL,
    `is_deleted` BOOLEAN DEFAULT FALSE,
    `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

create table IF NOT EXISTS `user`(
	`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `pw` VARCHAR(100) NOT NULL,
    `is_deleted` BOOLEAN DEFAULT FALSE,
    `is_banned` BOOLEAN DEFAULT FALSE,
    `auth` INT DEFAULT 0,
    `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_date` DATETIME ON UPDATE CURRENT_TIMESTAMP,
    `last_login` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `email` NOT NULL,
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

create table IF NOT EXISTS `collection`(
	`id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	`store_id` INT NOT NULL,
	`uid` INT NOT NULL UNSIGNED,
    `is_deleted` BOOLEAN DEFAULT FALSE,
    `create_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_date` DATETIME ON UPDATE CURRENT_TIMESTAMP
)ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
