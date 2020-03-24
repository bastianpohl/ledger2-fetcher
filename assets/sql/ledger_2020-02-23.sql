# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.4.11-MariaDB)
# Database: ledger
# Generation Time: 2020-02-23 21:07:41 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table accounts_users_relations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `accounts_users_relations`;

CREATE TABLE `accounts_users_relations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account` int(11) DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `accounts_users_relations` WRITE;
/*!40000 ALTER TABLE `accounts_users_relations` DISABLE KEYS */;

INSERT INTO `accounts_users_relations` (`id`, `account`, `user`)
VALUES
	(1,1,1),
	(2,2,1);

/*!40000 ALTER TABLE `accounts_users_relations` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`id`, `account`, `title`)
VALUES
	(1,1,'Tanken'),
	(2,1,'Lebensmittel');

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(36) DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `token_valid_from` date DEFAULT NULL,
  `token_valid_to` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;

INSERT INTO `sessions` (`id`, `token`, `user`, `token_valid_from`, `token_valid_to`)
VALUES
	(1,'2d323d64-59a9-4ded-b515-b4cc987ba29a',1,'2020-02-01','2020-12-20'),
	(2,'cbf2a075-436a-43d3-9641-57801acd8bff',1,'2020-02-22','2020-02-27'),
	(3,'0d83e307-62a9-4a19-b2e3-87a0af06ef70',1,'2020-02-22','2020-02-27'),
	(4,'bf716141-5daf-4ce8-9c25-3801a38adbbc',1,'2020-02-22','2020-02-27'),
	(5,'ebeb41df-17cd-41ba-b4b7-64446cb061a5',1,'2020-02-22','2020-02-27'),
	(6,'dd7ab045-814e-4eb7-b5aa-db317c990d7e',1,'2020-02-22','2020-02-27');

/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user` char(11) DEFAULT '',
  `pass_hash` varchar(255) DEFAULT NULL,
  `pass_salt` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `user`, `pass_hash`, `pass_salt`)
VALUES
	(1,'chewie','7619957f60140a778a36fccaf145b98495c55e43ed2e984b23bbe548e60fc2f3','söfksödf');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
