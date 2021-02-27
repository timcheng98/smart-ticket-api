-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2021 at 09:18 AM
-- Server version: 8.0.19
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_ticket_api_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_account`
--

CREATE TABLE `admin_account` (
  `admin_id` int NOT NULL,
  `first_name` varchar(64) NOT NULL,
  `last_name` varchar(64) NOT NULL,
  `ctime` int UNSIGNED NOT NULL,
  `utime` int UNSIGNED NOT NULL,
  `status` tinyint NOT NULL,
  `is_active` tinyint NOT NULL,
  `role` tinyint NOT NULL,
  `email` varchar(64) NOT NULL,
  `mobile` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `wallet_address` varchar(256) NOT NULL,
  `is_mobile_verfied` tinyint NOT NULL,
  `is_email_verfied` tinyint NOT NULL,
  `need_kyc` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=	utf8mb4_general_ci;

--
-- Dumping data for table `admin_account`
--

INSERT INTO `admin_account` (`admin_id`, `first_name`, `last_name`, `ctime`, `utime`, `status`, `is_active`, `role`, `email`, `mobile`, `password`, `wallet_address`, `is_mobile_verfied`, `is_email_verfied`, `need_kyc`) VALUES
(1, 'tim', 'cheng', 1605343960, 1605343960, 1, 1, 1, 'timchengy@gmail.com', '+852-56281088', '12345678', 'xxxxx', 1, 1, 0),
(2, 'Client first name', 'Client last name', 1605343960, 1605343960, 1, 1, 2, 'abc@123.com', '+852-56281088', '12345678', 'xxxxx', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `company_kyc`
--

CREATE TABLE `company_kyc` (
  `company_kyc_id` int NOT NULL,
  `admin_id` int NOT NULL,
  `check_by` int NOT NULL,
  `company_code` varchar(64) NOT NULL,
  `reference_no` varchar(128) NOT NULL,
  `name` varchar(256) NOT NULL,
  `owner` varchar(64) NOT NULL,
  `description` text NOT NULL,
  `industry` varchar(64) NOT NULL,
  `company_doc` varchar(128) NOT NULL,
  `is_company_doc_verified` tinyint NOT NULL,
  `company_size` varchar(64) NOT NULL,
  `address` text NOT NULL,
  `found_date` int NOT NULL,
  `status` tinyint NOT NULL COMMENT '2: success, 1: pending, 0: draft, -1: reject',
  `reject_reason` mediumtext CHARACTER SET utf8mb4 COLLATE 	utf8mb4_general_ci,
  `ctime` int UNSIGNED NOT NULL,
  `utime` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=	utf8mb4_general_ci;

--
-- Dumping data for table `company_kyc`
--

INSERT INTO `company_kyc` (`company_kyc_id`, `admin_id`, `check_by`, `company_code`, `reference_no`, `name`, `owner`, `description`, `industry`, `company_doc`, `is_company_doc_verified`, `company_size`, `address`, `found_date`, `status`, `reject_reason`, `ctime`, `utime`) VALUES
(16, 2, 0, '12345', '210104-4d78', 'Emperor Entertainment Group', '楊受成', '英皇娛樂集團，是英皇集團旗下演藝娛樂公司，主要業務包括本地及海外唱片製作及發行、音樂出版、藝人管理及演唱會製作。 英皇娛樂在過去十年間所發行的音樂專輯及影音產品超過五百張，而且累計銷量超過十億張。', '演藝娛樂', 'upload_file_210104185427.png', 1, '1000', '香港灣仔軒尼詩道288號 英皇集團中心27樓', 1609757038, 0, NULL, 1609757038, 1609782285);

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `event_id` int NOT NULL,
  `event_code` varchar(64) NOT NULL,
  `admin_id` int NOT NULL,
  `name` varchar(256) NOT NULL,
  `country` varchar(64) NOT NULL,
  `region` varchar(64) NOT NULL,
  `location` varchar(256) CHARACTER SET utf8mb4 COLLATE 	utf8mb4_general_ci NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '2: success, 1: pending, 0: draft, -1: reject',
  `address` text NOT NULL,
  `issued_tickets` int NOT NULL DEFAULT '0',
  `short_desc` varchar(256) NOT NULL,
  `long_desc` mediumtext NOT NULL,
  `type` int UNSIGNED NOT NULL,
  `start_time` int UNSIGNED NOT NULL,
  `end_time` int UNSIGNED NOT NULL,
  `released_date` int UNSIGNED NOT NULL,
  `close_date` int UNSIGNED NOT NULL,
  `need_kyc` int UNSIGNED NOT NULL DEFAULT '1',
  `ctime` int UNSIGNED NOT NULL,
  `utime` int UNSIGNED NOT NULL,
  `approval_doc` varchar(128) CHARACTER SET utf8mb4 COLLATE 	utf8mb4_general_ci DEFAULT NULL,
  `seat_doc` varchar(128) CHARACTER SET utf8mb4 COLLATE 	utf8mb4_general_ci DEFAULT NULL,
  `is_seat_doc_verified` tinyint NOT NULL DEFAULT '0',
  `is_approval_doc_verified` tinyint NOT NULL DEFAULT '0',
  `reject_reason` mediumtext CHARACTER SET utf8mb4 COLLATE 	utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=	utf8mb4_general_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`event_id`, `event_code`, `admin_id`, `name`, `country`, `region`, `location`, `status`, `address`, `issued_tickets`, `short_desc`, `long_desc`, `type`, `start_time`, `end_time`, `released_date`, `close_date`, `need_kyc`, `ctime`, `utime`, `approval_doc`, `seat_doc`, `is_seat_doc_verified`, `is_approval_doc_verified`, `reject_reason`) VALUES
(1, 'EjPpCbBaK', 2, 'GREEN DAY Live in Hong Kong', '', '', '', 1, '', 0, 'Green Day recently released their single “Father Of All…,” which is the lead track on their forthcoming thirteenth studio album of the same name, out 7 February 2020 on Reprise / Warner Records.', 'Singapore will be the very first stop as the rock icons embark on a global stadium tour that includes solo dates in Asia and Europe. Then in June, the band will tour with co-headliners Weezer and Fall Out Boy - The Hella Mega Tour presented by Harley-Davidson, in June then visit Europe, UK and North America, visit cities throughout Europe, the U.K. and North America.\n\nFormed in 1986 in Berkeley, CA, Green Day is one of the world’s best-selling bands of all time, with more than 70 million records sold worldwide and 10 billion cumulative audio/visual streams. Their 1994 breakout album Dookie, which sold over 10 million and achieved diamond status, is widely credited with popularizing and reviving mainstream interest in punk rock, catapulting a career-long run of #1 hit singles.', 0, 1610103600, 1610110800, 1609689600, 1609991999, 1, 1608480912, 1609759070, 'upload_file_210104141704.jpeg', NULL, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `media_upload`
--

CREATE TABLE `media_upload` (
  `media_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `filename` varchar(256) NOT NULL,
  `filepath` varchar(256) NOT NULL,
  `mimetype` varchar(16) NOT NULL,
  `filesize` int NOT NULL,
  `originalname` varchar(256) NOT NULL,
  `checksum` varchar(256) NOT NULL,
  `is_active` tinyint NOT NULL,
  `ctime` int NOT NULL,
  `utime` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=	utf8mb4_general_ci;

--
-- Dumping data for table `media_upload`
--

INSERT INTO `media_upload` (`media_id`, `user_id`, `admin_id`, `filename`, `filepath`, `mimetype`, `filesize`, `originalname`, `checksum`, `is_active`, `ctime`, `utime`) VALUES
(1, NULL, NULL, 'upload_file_201115033006.jpeg', 'media/upload_file_201115033006.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605382206, 1605382206),
(2, NULL, NULL, 'upload_file_201115034220.jpeg', 'media/upload_file_201115034220.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605382940, 1605382940),
(3, NULL, NULL, 'upload_file_201115034435.jpeg', 'media/upload_file_201115034435.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605383075, 1605383075),
(4, NULL, NULL, 'upload_file_201115040625.jpeg', 'media/upload_file_201115040625.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605384385, 1605384385),
(5, NULL, NULL, 'upload_file_201115040748.jpeg', 'media/upload_file_201115040748.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605384468, 1605384468),
(6, 0, 0, 'upload_file_201115041014.jpeg', 'media/upload_file_201115041014.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605384614, 1605384614),
(7, 0, 0, 'upload_file_201115041105.jpeg', 'media/upload_file_201115041105.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605384665, 1605384665),
(8, 0, 0, 'upload_file_201115041151.jpeg', 'media/upload_file_201115041151.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605384711, 1605384711),
(9, 0, 0, 'upload_file_201115041230.jpeg', 'media/upload_file_201115041230.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605384750, 1605384750),
(10, 0, 0, 'upload_file_201115041307.jpeg', 'media/upload_file_201115041307.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605384787, 1605384787),
(11, 0, 1, 'upload_file_201115041345.jpeg', 'media/upload_file_201115041345.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605384825, 1605384825),
(12, 0, 1, 'upload_file_201115041752.jpeg', 'media/upload_file_201115041752.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605385072, 1605385072),
(13, 0, 1, 'upload_file_201115042522.jpeg', 'media/upload_file_201115042522.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605385522, 1605385522),
(14, 0, 1, 'upload_file_201115042556.jpeg', 'media/upload_file_201115042556.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605385556, 1605385556),
(15, 0, 1, 'upload_file_201115043023.jpeg', 'media/upload_file_201115043023.jpeg', 'image/jpeg', 1017221, 'kzLU6FedHgu7EXgqAkOBXCB85eavivaiO-N6Ojvjejo.jpeg', '', 1, 1605385823, 1605385823),
(16, 0, 1, 'upload_file_201115043046.png', 'media/upload_file_201115043046.png', 'image/png', 190218, '截圖 2020-11-09 下午12.02.54.png', '', 1, 1605385846, 1605385846),
(17, 0, 1, 'upload_file_201115043730.jpeg', 'media/upload_file_201115043730.jpeg', 'image/jpeg', 1017221, 'kzLU6FedHgu7EXgqAkOBXCB85eavivaiO-N6Ojvjejo.jpeg', '', 1, 1605386250, 1605386250),
(18, 0, 1, 'upload_file_201115044001.png', 'media/upload_file_201115044001.png', 'image/png', 380108, '截圖 2020-11-09 下午12.13.14.png', '', 1, 1605386401, 1605386401),
(19, 0, 1, 'upload_file_201115044017.jpeg', 'media/upload_file_201115044017.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605386417, 1605386417),
(20, 0, 1, 'upload_file_201115044037.jpeg', 'media/upload_file_201115044037.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605386437, 1605386437),
(21, 0, 1, 'upload_file_201115044043.jpeg', 'media/upload_file_201115044043.jpeg', 'image/jpeg', 453780, '200224_CR_千島湖3.jpg', '', 1, 1605386443, 1605386443),
(22, 0, 1, 'upload_file_201115044049.jpeg', 'media/upload_file_201115044049.jpeg', 'image/jpeg', 823481, 'd275e37d52ce3f46_1280x622.jpg', '', 1, 1605386449, 1605386449),
(23, 0, 1, 'upload_file_201115044726.jpeg', 'media/upload_file_201115044726.jpeg', 'image/jpeg', 823481, 'd275e37d52ce3f46_1280x622.jpg', '', 1, 1605386846, 1605386846),
(24, 0, 1, 'upload_file_201115044745.jpeg', 'media/upload_file_201115044745.jpeg', 'image/jpeg', 823481, 'd275e37d52ce3f46_1280x622.jpg', '', 1, 1605386865, 1605386865),
(25, 0, 1, 'upload_file_201115044852.jpeg', 'media/upload_file_201115044852.jpeg', 'image/jpeg', 823481, 'd275e37d52ce3f46_1280x622.jpg', '', 1, 1605386932, 1605386932),
(26, 0, 1, 'upload_file_201115045115.jpeg', 'media/upload_file_201115045115.jpeg', 'image/jpeg', 823481, 'd275e37d52ce3f46_1280x622.jpg', '', 1, 1605387075, 1605387075),
(27, 0, 1, 'upload_file_201115045243.png', 'media/upload_file_201115045243.png', 'image/png', 2776237, 'closeup-shot-female-wearing-beautiful-silver-necklace-with-pendant.png', '', 1, 1605387163, 1605387163),
(28, 0, 1, 'upload_file_201115045333.jpeg', 'media/upload_file_201115045333.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605387213, 1605387213),
(29, 0, 1, 'upload_file_201115045952.jpeg', 'media/upload_file_201115045952.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605387592, 1605387592),
(30, 0, 1, 'upload_file_201115050039.jpeg', 'media/upload_file_201115050039.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605387640, 1605387640),
(31, 0, 1, 'upload_file_201115050115.jpeg', 'media/upload_file_201115050115.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605387675, 1605387675),
(32, 0, 1, 'upload_file_201115144647.jpeg', 'media/upload_file_201115144647.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605422807, 1605422807),
(33, 0, 1, 'upload_file_201115144854.jpeg', 'media/upload_file_201115144854.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605422934, 1605422934),
(34, 0, 1, 'upload_file_201115145155.jpeg', 'media/upload_file_201115145155.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605423115, 1605423115),
(35, 0, 1, 'upload_file_201115145233.jpeg', 'media/upload_file_201115145233.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605423154, 1605423154),
(36, 0, 1, 'upload_file_201115145321.jpeg', 'media/upload_file_201115145321.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605423201, 1605423201),
(37, 0, 1, 'upload_file_201115145706.jpeg', 'media/upload_file_201115145706.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605423426, 1605423426),
(38, 0, 1, 'upload_file_201115145906.jpeg', 'media/upload_file_201115145906.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605423546, 1605423546),
(39, 0, 1, 'upload_file_201115145916.jpeg', 'media/upload_file_201115145916.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605423556, 1605423556),
(40, 0, 1, 'upload_file_201115150144.jpeg', 'media/upload_file_201115150144.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605423704, 1605423704),
(41, 0, 1, 'upload_file_201115150204.jpeg', 'media/upload_file_201115150204.jpeg', 'image/jpeg', 3217723, 'pexels-nout-gons-378570.jpg', '', 1, 1605423724, 1605423724),
(42, 0, 1, 'upload_file_201115150211.jpeg', 'media/upload_file_201115150211.jpeg', 'image/jpeg', 163805, '0fbc504fa9354df9a32e38871a1327dd.jpg', '', 1, 1605423731, 1605423731),
(43, 0, 1, 'upload_file_201115150221.jpeg', 'media/upload_file_201115150221.jpeg', 'image/jpeg', 353149, 'WhatsApp Image 2020-11-08 at 01.24.05.jpeg', '', 1, 1605423741, 1605423741),
(44, 0, 1, 'upload_file_201115161737.jpeg', 'media/upload_file_201115161737.jpeg', 'image/jpeg', 353149, 'WhatsApp Image 2020-11-08 at 01.24.05.jpeg', '', 1, 1605428257, 1605428257),
(45, 0, 1, 'upload_file_201115162122.jpeg', 'media/upload_file_201115162122.jpeg', 'image/jpeg', 353149, 'WhatsApp Image 2020-11-08 at 01.24.05.jpeg', '', 1, 1605428482, 1605428482),
(46, 0, 1, 'upload_file_201115162257.jpeg', 'media/upload_file_201115162257.jpeg', 'image/jpeg', 353149, 'WhatsApp Image 2020-11-08 at 01.24.05.jpeg', '', 1, 1605428577, 1605428577),
(47, 0, 1, 'upload_file_201115162356.jpeg', 'media/upload_file_201115162356.jpeg', 'image/jpeg', 353149, 'WhatsApp Image 2020-11-08 at 01.24.05.jpeg', '', 1, 1605428636, 1605428636),
(48, 0, 1, 'upload_file_201115162538.jpeg', 'media/upload_file_201115162538.jpeg', 'image/jpeg', 353149, 'WhatsApp Image 2020-11-08 at 01.24.05.jpeg', '', 1, 1605428738, 1605428738),
(49, 0, 1, 'upload_file_201115165641.jpeg', 'media/upload_file_201115165641.jpeg', 'image/jpeg', 146697, 'w644.jpeg', '', 1, 1605430601, 1605430601),
(50, 0, 2, 'upload_file_201115182803.png', 'media/upload_file_201115182803.png', 'image/png', 2776237, 'closeup-shot-female-wearing-beautiful-silver-necklace-with-pendant.png', '', 1, 1605436083, 1605436083),
(51, 0, 2, 'upload_file_201115184745.png', 'media/upload_file_201115184745.png', 'image/png', 27616, 'Business-Registration-Certificate.png', '', 1, 1605437265, 1605437265),
(52, 0, 2, 'upload_file_201202004816.png', 'media/upload_file_201202004816.png', 'image/png', 190218, '截圖 2020-11-09 下午12.02.54.png', '', 1, 1606841296, 1606841296),
(53, 0, 2, 'upload_file_201221013512.jpeg', 'media\\upload_file_201221013512.jpeg', 'image/jpeg', 182493, 'Tom Clancy\'s Rainbow Six® Siege2018-5-17-20-34-32.jpg', '', 1, 1608485712, 1608485712),
(54, 0, 2, 'upload_file_201221014743.jpeg', 'media\\upload_file_201221014743.jpeg', 'image/jpeg', 182493, 'Tom Clancy\'s Rainbow Six® Siege2018-5-17-20-34-32.jpg', '', 1, 1608486463, 1608486463),
(55, 0, 2, 'upload_file_210104141704.jpeg', 'media\\upload_file_210104141704.jpeg', 'image/jpeg', 29272, 'sfx2967.jpg', '', 1, 1609741024, 1609741024),
(56, 0, 2, 'upload_file_210104184622.png', 'media\\upload_file_210104184622.png', 'image/png', 135649, '截圖 2021-01-04 下午6.46.05.png', '', 1, 1609757182, 1609757182),
(57, 0, 2, 'upload_file_210104184640.png', 'media\\upload_file_210104184640.png', 'image/png', 135649, '截圖 2021-01-04 下午6.46.05.png', '', 1, 1609757200, 1609757200),
(58, 0, 2, 'upload_file_210104185114.png', 'media\\upload_file_210104185114.png', 'image/png', 52612, '截圖 2021-01-03 上午12.43.09.png', '', 1, 1609757474, 1609757474),
(59, 0, 2, 'upload_file_210104185246.png', 'media\\upload_file_210104185246.png', 'image/png', 135649, '截圖 2021-01-04 下午6.46.05.png', '', 1, 1609757566, 1609757566),
(60, 0, 2, 'upload_file_210104185349.png', 'media\\upload_file_210104185349.png', 'image/png', 135649, '截圖 2021-01-04 下午6.46.05.png', '', 1, 1609757629, 1609757629),
(61, 0, 2, 'upload_file_210104185427.png', 'media\\upload_file_210104185427.png', 'image/png', 135649, '截圖 2021-01-04 下午6.46.05.png', '', 1, 1609757667, 1609757667);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=	utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('4MsK_M7UoHf9XD4FH3pB_t9ieVYZvEB5', 1610266090, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),
('Kgk0PeXg28rEtHcm0p7zCwj70e2A9GE8', 1610266678, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int NOT NULL,
  `first_name` varchar(64) NOT NULL,
  `last_name` varchar(64) NOT NULL,
  `ctime` int UNSIGNED NOT NULL,
  `utime` int UNSIGNED NOT NULL,
  `status` tinyint NOT NULL,
  `is_active` tinyint NOT NULL,
  `role` tinyint NOT NULL,
  `email` varchar(64) NOT NULL,
  `mobile` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `wallet_address` varchar(256) NOT NULL,
  `is_mobile_verfied` tinyint NOT NULL,
  `is_email_verfied` tinyint NOT NULL,
  `need_kyc` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=	utf8mb4_general_ci;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`user_id`, `first_name`, `last_name`, `ctime`, `utime`, `status`, `is_active`, `role`, `email`, `mobile`, `password`, `wallet_address`, `is_mobile_verfied`, `is_email_verfied`, `need_kyc`) VALUES
(1, 'Tim', 'Cheng', 0, 0, 1, 1, 1, 'timchengy@gmail.com', '562810888', '12345678', '', 0, 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_account`
--
ALTER TABLE `admin_account`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `company_kyc`
--
ALTER TABLE `company_kyc`
  ADD PRIMARY KEY (`company_kyc_id`),
  ADD UNIQUE KEY `admin_id_2` (`admin_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`event_id`),
  ADD UNIQUE KEY `event_code` (`event_code`),
  ADD UNIQUE KEY `admin_account_id_2` (`admin_id`),
  ADD KEY `admin_account_id` (`admin_id`);

--
-- Indexes for table `media_upload`
--
ALTER TABLE `media_upload`
  ADD PRIMARY KEY (`media_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_account`
--
ALTER TABLE `admin_account`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `company_kyc`
--
ALTER TABLE `company_kyc`
  MODIFY `company_kyc_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `event_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `media_upload`
--
ALTER TABLE `media_upload`
  MODIFY `media_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
