-- MySQL dump 10.13  Distrib 5.6.36, for Linux (x86_64)
--
-- Host: localhost    Database: mirna_22b
-- ------------------------------------------------------
-- Server version	5.6.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `confidence`
--

DROP TABLE IF EXISTS `confidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `confidence` (
  `mirna_id` varchar(20) NOT NULL DEFAULT '',
  `auto_mirna` int(10) NOT NULL DEFAULT '0',
  `exp_count` int(5) NOT NULL DEFAULT '0',
  `5p_count` double NOT NULL DEFAULT '0',
  `5p_raw_count` float NOT NULL DEFAULT '0',
  `3p_count` float NOT NULL DEFAULT '0',
  `3p_raw_count` float NOT NULL DEFAULT '0',
  `5p_consistent` float NOT NULL DEFAULT '0',
  `5p_mature_consistent` decimal(4,0) NOT NULL DEFAULT '0',
  `3p_consistent` float NOT NULL DEFAULT '0',
  `3p_mature_consistent` decimal(4,0) NOT NULL DEFAULT '0',
  `5p_overhang` int(2) DEFAULT NULL,
  `3p_overhang` int(2) DEFAULT NULL,
  `energy_precursor` float DEFAULT '0',
  `energy_by_length` float NOT NULL,
  `paired_hairpin` float NOT NULL DEFAULT '0',
  `mirdeep_score` double NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `confidence_score`
--

DROP TABLE IF EXISTS `confidence_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `confidence_score` (
  `auto_mirna` int(10) NOT NULL,
  `confidence` int(2) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dead_mirna`
--

DROP TABLE IF EXISTS `dead_mirna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dead_mirna` (
  `mirna_acc` varchar(9) NOT NULL DEFAULT '',
  `mirna_id` varchar(40) NOT NULL DEFAULT '',
  `previous_id` varchar(100) DEFAULT NULL,
  `forward_to` varchar(20) DEFAULT NULL,
  `comment` mediumtext
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `literature_references`
--

DROP TABLE IF EXISTS `literature_references`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `literature_references` (
  `auto_lit` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `medline` int(10) unsigned DEFAULT NULL,
  `title` tinytext,
  `author` tinytext,
  `journal` tinytext,
  PRIMARY KEY (`auto_lit`),
  FULLTEXT KEY `text_index` (`title`,`author`)
) ENGINE=MyISAM AUTO_INCREMENT=2512 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mature_database_links`
--

DROP TABLE IF EXISTS `mature_database_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mature_database_links` (
  `auto_mature` int(10) unsigned NOT NULL DEFAULT '0',
  `auto_db` int(10) unsigned NOT NULL DEFAULT '0',
  `link` tinytext NOT NULL,
  `display_name` tinytext NOT NULL,
  UNIQUE KEY `mature_database_links` (`auto_mature`,`auto_db`,`link`(100))
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mature_database_url`
--

DROP TABLE IF EXISTS `mature_database_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mature_database_url` (
  `auto_db` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `display_name` tinytext NOT NULL,
  `url` tinytext NOT NULL,
  `type` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`auto_db`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna`
--

DROP TABLE IF EXISTS `mirna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna` (
  `auto_mirna` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mirna_acc` varchar(9) NOT NULL DEFAULT '',
  `mirna_id` varchar(40) NOT NULL DEFAULT '',
  `previous_mirna_id` text NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `sequence` blob,
  `comment` longtext,
  `auto_species` int(10) unsigned NOT NULL DEFAULT '0',
  `dead_flag` tinyint(1) NOT NULL,
  PRIMARY KEY (`auto_mirna`),
  UNIQUE KEY `mirna_acc` (`mirna_acc`),
  KEY `auto_species_inx` (`auto_species`),
  FULLTEXT KEY `comment_index` (`comment`),
  FULLTEXT KEY `description_index` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=134258 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_2_prefam`
--

DROP TABLE IF EXISTS `mirna_2_prefam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_2_prefam` (
  `auto_mirna` int(10) unsigned NOT NULL DEFAULT '0',
  `auto_prefam` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`auto_mirna`,`auto_prefam`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_chromosome_build`
--

DROP TABLE IF EXISTS `mirna_chromosome_build`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_chromosome_build` (
  `auto_mirna` int(10) unsigned NOT NULL DEFAULT '0',
  `xsome` varchar(20) DEFAULT NULL,
  `contig_start` bigint(20) DEFAULT NULL,
  `contig_end` bigint(20) DEFAULT NULL,
  `strand` char(2) DEFAULT NULL,
  KEY `auto_mirna` (`auto_mirna`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_context`
--

DROP TABLE IF EXISTS `mirna_context`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_context` (
  `auto_mirna` int(10) unsigned NOT NULL DEFAULT '0',
  `transcript_id` varchar(50) DEFAULT NULL,
  `overlap_sense` char(2) DEFAULT NULL,
  `overlap_type` varchar(20) DEFAULT NULL,
  `number` int(4) DEFAULT NULL,
  `transcript_source` varchar(50) DEFAULT NULL,
  `transcript_name` varchar(50) DEFAULT NULL,
  KEY `auto_mirna_inx` (`auto_mirna`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_database_links`
--

DROP TABLE IF EXISTS `mirna_database_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_database_links` (
  `auto_mirna` int(10) unsigned NOT NULL DEFAULT '0',
  `auto_db` int(11) DEFAULT NULL,
  `link` tinytext NOT NULL,
  `display_name` tinytext NOT NULL,
  UNIQUE KEY `mirna_database_links` (`auto_mirna`,`link`(50))
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_database_url`
--

DROP TABLE IF EXISTS `mirna_database_url`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_database_url` (
  `auto_db` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `display_name` tinytext NOT NULL,
  `url` tinytext NOT NULL,
  PRIMARY KEY (`auto_db`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_literature_references`
--

DROP TABLE IF EXISTS `mirna_literature_references`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_literature_references` (
  `auto_mirna` int(10) unsigned NOT NULL DEFAULT '0',
  `auto_lit` int(10) unsigned NOT NULL DEFAULT '0',
  `comment` mediumtext,
  `order_added` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_mature`
--

DROP TABLE IF EXISTS `mirna_mature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_mature` (
  `auto_mature` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `mature_name` varchar(40) NOT NULL DEFAULT '',
  `previous_mature_id` text NOT NULL,
  `mature_acc` varchar(20) NOT NULL DEFAULT '',
  `evidence` mediumtext,
  `experiment` mediumtext,
  `similarity` mediumtext,
  `dead_flag` int(2) NOT NULL,
  PRIMARY KEY (`auto_mature`),
  KEY `mature_name_inx` (`mature_name`),
  KEY `mature_acc_inx` (`mature_acc`)
) ENGINE=MyISAM AUTO_INCREMENT=130021 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_pre_mature`
--

DROP TABLE IF EXISTS `mirna_pre_mature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_pre_mature` (
  `auto_mirna` int(10) unsigned NOT NULL DEFAULT '0',
  `auto_mature` int(10) unsigned NOT NULL DEFAULT '0',
  `mature_from` varchar(4) DEFAULT NULL,
  `mature_to` varchar(4) DEFAULT NULL,
  UNIQUE KEY `auto_mirna_2` (`auto_mirna`,`auto_mature`),
  UNIQUE KEY `auto_mirna_3` (`auto_mirna`,`auto_mature`),
  KEY `auto_mirna` (`auto_mirna`),
  KEY `auto_mature` (`auto_mature`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_prefam`
--

DROP TABLE IF EXISTS `mirna_prefam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_prefam` (
  `auto_prefam` int(10) NOT NULL AUTO_INCREMENT,
  `prefam_acc` varchar(15) NOT NULL DEFAULT '',
  `prefam_id` varchar(40) NOT NULL DEFAULT '',
  `description` text,
  PRIMARY KEY (`auto_prefam`),
  UNIQUE KEY `prefam_acc` (`prefam_acc`),
  UNIQUE KEY `prefam_id` (`prefam_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9142 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mirna_species`
--

DROP TABLE IF EXISTS `mirna_species`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mirna_species` (
  `auto_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `organism` varchar(10) DEFAULT NULL,
  `division` varchar(10) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `taxon_id` bigint(20) DEFAULT NULL,
  `taxonomy` varchar(200) DEFAULT NULL,
  `genome_assembly` varchar(50) DEFAULT '',
  `genome_accession` varchar(50) DEFAULT '',
  `ensembl_db` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`auto_id`),
  UNIQUE KEY `organism` (`organism`)
) ENGINE=MyISAM AUTO_INCREMENT=303 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-05-23 15:41:29
