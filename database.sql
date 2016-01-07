CREATE DATABASE IF NOT EXISTS SourceUndead;
USE SourceUndead;
CREATE TABLE IF NOT EXISTS players(
	id INT NOT NULL AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	username VARCHAR(50) NOT NULL,
	PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS zombie(
	id INT NOT NULL AUTO_INCREMENT,
	pid INT NOT NULL,
	infections INT NOT NULL DEFAULT 0,
	deaths INT NOT NULL DEFAULT 0,
	wins INT NOT NULL DEFAULT 0,
	resurrections INT NOT NULL DEFAULT 0,
	FOREIGN KEY (pid) REFERENCES players(id)
);
CREATE TABLE IF NOT EXISTS human(
	id INT NOT NULL AUTO_INCREMENT,
	pid INT NOT NULL,
	kills INT NOT NULL DEFAULT 0,
	deaths INT NOT NULL DEFAULT 0,
	wins INT NOT NULL DEFAULT 0,
	FOREIGN KEY (pid) REFERENCES players(id)
);
