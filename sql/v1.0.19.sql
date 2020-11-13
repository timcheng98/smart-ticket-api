-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 06, 2020 at 06:14 PM
-- Server version: 10.4.3-MariaDB-1:10.4.3+maria~bionic
-- PHP Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `smart_access_api_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `company_user_rfid`
--

CREATE TABLE `company_user_rfid` (
  `company_user_rfid_id` bigint(20) NOT NULL,
  `ctime` int(10) UNSIGNED NOT NULL,
  `utime` int(10) UNSIGNED NOT NULL,
  `company_user_id` int(10) UNSIGNED NOT NULL,
  `is_active` tinyint(4) NOT NULL,
  `tag_id` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passcode` char(32) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company_user_rfid`
--
ALTER TABLE `company_user_rfid`
  ADD PRIMARY KEY (`company_user_rfid_id`),
  ADD UNIQUE KEY `tag_id` (`tag_id`),
  ADD UNIQUE KEY `company_user_id` (`company_user_id`) USING BTREE,
  ADD KEY `utime` (`utime`),
  ADD KEY `passcode` (`passcode`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company_user_rfid`
--
ALTER TABLE `company_user_rfid`
  MODIFY `company_user_rfid_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `company_user_rfid`
--
ALTER TABLE `company_user_rfid`
  ADD CONSTRAINT `company_user_rfid_ibfk_1` FOREIGN KEY (`company_user_id`) REFERENCES `company_user` (`company_user_id`),
  ADD CONSTRAINT `company_user_rfid_ibfk_2` FOREIGN KEY (`passcode`) REFERENCES `controller_passcode` (`passcode`);
COMMIT;

ALTER TABLE `controller_passcode`  ADD `tag_id` VARCHAR(30) NOT NULL DEFAULT ''  AFTER `is_active`;

ALTER TABLE `company_door`  ADD `lock_control_pin` INT NOT NULL DEFAULT '-1'  AFTER `create_time`,  ADD `lock_status_pin` INT NOT NULL DEFAULT '-1'  AFTER `lock_control_pin`,  ADD `lock_status` VARCHAR(10) NOT NULL DEFAULT ''  AFTER `lock_status_pin`;