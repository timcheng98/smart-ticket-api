--
-- Updated in 30/10/2020 by David Yung
-- Database: `smart_access_api_dev`
--

-- Modiifcation the company_door table `door` field into INT(11)
ALTER TABLE `company_door` CHANGE `door` `door` INT(11) NOT NULL;

-- Creation in `controller_passcode` table `door` field with INT(11)
ALTER TABLE `controller_passcode` ADD `door` INT(11) NOT NULL DEFAULT '0' AFTER `tag_id`;

-- Creation in `company_door` table `door_ref` with VARCHAR(20)
ALTER TABLE `company_door` ADD `door_ref` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL AFTER `door`;