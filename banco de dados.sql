CREATE DATABASE  IF NOT EXISTS `sistema`
USE `sistema`;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NomeUsuario` varchar(255) NOT NULL,
  `senha_criptografada` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `veiculos`
--

DROP TABLE IF EXISTS `veiculos`;
CREATE TABLE `veiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `empresa` text,
  `modelo` text,
  `ano` int DEFAULT NULL,
  `motor` text,
  `cor` text,
  `categoria` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
