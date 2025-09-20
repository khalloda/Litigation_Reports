-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 19, 2025 at 05:34 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `litigation_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_work`
--

DROP TABLE IF EXISTS `admin_work`;
CREATE TABLE IF NOT EXISTS `admin_work` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lawyer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `work_date` date NOT NULL,
  `work_description` text COLLATE utf8mb4_unicode_ci,
  `work_location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `work_status` enum('pending','in_progress','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lawyer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attendance_date` date NOT NULL,
  `attendance_situation` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_attendance_lawyer` (`lawyer_name`),
  KEY `idx_attendance_date` (`attendance_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cases`
--

DROP TABLE IF EXISTS `cases`;
CREATE TABLE IF NOT EXISTS `cases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `matter_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_ar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_en` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_capacity` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `opponent_capacity` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_subject` text COLLATE utf8mb4_unicode_ci,
  `matter_status` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_degree` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_importance` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_start_date` date DEFAULT NULL,
  `matter_end_date` date DEFAULT NULL,
  `circuit_secretary` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_asked_amount` decimal(15,2) DEFAULT NULL,
  `matter_judged_amount` decimal(15,2) DEFAULT NULL,
  `client_branch` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_shelf` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `court_floor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `court_hall` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secretary_room` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_court` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_circuit` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_destination` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_select` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_partner` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_notes1` text COLLATE utf8mb4_unicode_ci,
  `matter_notes2` text COLLATE utf8mb4_unicode_ci,
  `lawyer_a` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lawyer_b` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `matter_evaluation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `financial_allocation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `work_team_id` int DEFAULT NULL,
  `contract_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matter_id` (`matter_id`),
  KEY `work_team_id` (`work_team_id`),
  KEY `idx_case_client_id` (`client_id`),
  KEY `idx_case_matter_id` (`matter_id`),
  KEY `idx_case_status` (`matter_status`),
  KEY `idx_case_court` (`matter_court`)
) ENGINE=InnoDB AUTO_INCREMENT=1708 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cases`
--

INSERT INTO `cases` (`id`, `client_id`, `matter_id`, `matter_ar`, `matter_en`, `client_capacity`, `opponent_capacity`, `matter_subject`, `matter_status`, `matter_category`, `matter_degree`, `matter_importance`, `matter_start_date`, `matter_end_date`, `circuit_secretary`, `matter_asked_amount`, `matter_judged_amount`, `client_branch`, `matter_shelf`, `court_floor`, `court_hall`, `secretary_room`, `matter_court`, `matter_circuit`, `matter_destination`, `matter_select`, `matter_partner`, `matter_notes1`, `matter_notes2`, `lawyer_a`, `lawyer_b`, `matter_evaluation`, `financial_allocation`, `work_team_id`, `contract_id`, `created_at`, `updated_at`) VALUES
(1702, 1, '2025-0001', 'قضية تجريبية جديدة 878/2025', 'New Test Case', NULL, NULL, 'This is a test case created via API', 'active', 'civil', NULL, 'medium', '2025-09-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'محكمة النقض', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 18:17:45', '2025-09-18 08:38:45'),
(1703, 1, '2025-0002', 'قضية تجريبية جديدة', 'New Test Case', NULL, NULL, 'This is a test case created via API', 'active', 'civil', NULL, 'medium', '2025-09-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'محكمة النقض', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 18:20:20', '2025-09-16 18:20:20'),
(1704, 1, '2025-0003', 'قضية تجريبية جديدة', 'New Test Case', NULL, NULL, 'This is a test case created via API', 'active', 'civil', NULL, 'medium', '2025-09-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'محكمة النقض', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 18:20:52', '2025-09-16 18:20:52'),
(1705, 1, '2025-0004', 'قضية تجريبية جديدة', 'New Test Case', NULL, NULL, 'This is a test case created via API', 'active', 'civil', NULL, 'medium', '2025-09-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'محكمة النقض', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 18:22:36', '2025-09-16 18:22:36'),
(1706, 1, '2025-0005', 'قضية تجريبية جديدة', 'New Test Case', NULL, NULL, 'This is a test case created via API', 'active', 'civil', NULL, 'medium', '2025-09-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'محكمة النقض', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 19:02:00', '2025-09-16 19:02:00'),
(1707, 1, '2025-0006', 'قضية تجريبية جديدة', 'New Test Case', NULL, NULL, 'This is a test case created via API', 'active', 'civil', NULL, 'medium', '2025-09-16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'محكمة النقض', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 19:15:50', '2025-09-16 19:15:50');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_name_ar` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_name_en` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_type` enum('individual','company') COLLATE utf8mb4_unicode_ci DEFAULT 'company',
  `cash_pro_bono` enum('cash','probono') COLLATE utf8mb4_unicode_ci DEFAULT 'cash',
  `status` enum('active','disabled','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_lawyer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_ar` text COLLATE utf8mb4_unicode_ci,
  `address_en` text COLLATE utf8mb4_unicode_ci,
  `notes_ar` text COLLATE utf8mb4_unicode_ci,
  `notes_en` text COLLATE utf8mb4_unicode_ci,
  `client_start_date` date DEFAULT NULL,
  `client_end_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_client_status` (`status`),
  KEY `idx_client_cash_pro_bono` (`cash_pro_bono`)
) ENGINE=InnoDB AUTO_INCREMENT=315 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_name_ar`, `client_name_en`, `client_type`, `cash_pro_bono`, `status`, `logo`, `contact_lawyer`, `email`, `phone`, `address_ar`, `address_en`, `notes_ar`, `notes_en`, `client_start_date`, `client_end_date`, `created_at`, `updated_at`) VALUES
(1, '????? ?????? ??????', 'Sarie Eldin & Partners', 'company', 'probono', 'active', 'Sarie El-Din new logo.png', '????? ??????', NULL, NULL, NULL, NULL, NULL, NULL, '2009-01-01', NULL, '2025-09-16 08:38:56', '2025-09-18 17:53:22'),
(2, '??????', 'Al Futtaim', 'company', 'cash', 'disabled', 'Al-Futtaim-Co-AE-2Lines-300x262.jpg', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(3, '?????? ??????', 'Toyota Egypt', 'company', 'cash', 'active', 'toyota logo.png', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(4, '????? ????', 'Transocean Offshore International Limited', 'company', 'cash', 'disabled', 'transocean.png', '???? ?????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(5, '?????? ?????', 'Al Khaleej Sugar Co.', 'company', 'cash', 'disabled', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(6, '???? ??????', 'Ahmed El-Razaz', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(7, '???????? ???????', 'Engineering for Dev. of Tourism and Real Estate', 'company', 'cash', 'disabled', '', '???? ?????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(8, '???????? ????????', 'Cars Engineering', 'company', 'cash', 'disabled', '', '???? ?????', NULL, NULL, NULL, NULL, NULL, NULL, '2010-07-04', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(9, '????? ????', 'Amira Kamel', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(10, '???? ????? ??? ?????', 'Hussein Othman Sarie El-Din', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(11, '??????', 'Mobaco', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(12, '??????? ???', 'Bavaria Egypt', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '2010-11-01', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(13, '??? ?? ?? ?? ?????????', 'HSBC Securities (Egypt) SAE', 'company', 'cash', 'disabled', 'hsbc.gif', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(14, '????????', 'Orascom', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(15, '??? ??????? ????????', 'The Industrial Development Bank', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(16, '??? ????????', 'Maha Al Shabiny', 'company', 'cash', 'disabled', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(17, '??????? ?????', 'Husseiny Brothers', 'company', '', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(18, '???? ????', 'City Trade Group', 'company', '', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(19, '???????', 'Trianon Food & Bakery', 'company', 'cash', 'active', 'trianon.jpg', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(20, '???????', 'Artiyapi', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(21, '??????? ??? ?????? (????? + ?????)', 'Etal Group', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(22, '?????', 'Prime Holding', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(23, '????? ?????? ??????? ????', 'El-Sayed Nasef', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(24, '???????', 'Concord', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(25, '???? ???????', 'Ahmed Harishy', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(26, '??????', 'MIRACO', 'company', 'probono', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(27, '???? ?????', 'Hatem Kharboush', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(28, '???????', 'Sofisat Telecommunication Company', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(29, '????? ???????', 'Mahmoud Shawky Al Mutainy', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(30, '??? ??????', 'High Travel', 'company', 'cash', 'disabled', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(31, ' ??????? ???????', 'El Nasr International Exchange Co.', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(32, '?????? ???', 'Egypt Car', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(33, '????? ???? ????? ???????', 'Shaimaa Hussien', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(34, '?????? ???', 'Lecico Egypt S.A.E', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(35, '????? ??? ????? ???? ??? ??? ??? ????? ???? ??', 'Alb Saad El-Din Mohamed Beck', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(36, '????????', 'Solutions Company for Financial Investments', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(37, '?????? ???????', 'New Menia', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(38, '????? ???? ???? ????', 'Neven Hosny', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(39, '???? ??????- ??? ????- ??? ?????- ???? ??????- ???? ??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(40, '???????? ?????????', 'Al Mansoura for Resins & Chemical Industries', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(41, '???????? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(42, '?? ?? ???????', 'TN Holdings', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(43, '???? ???? ????? ??????? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(44, '????? ??????', 'Smart Villages', 'company', 'cash', 'disabled', 'Smart-Village-Company.jpg', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(45, '?????', 'EFG Hermes Securities Brokerage', 'company', 'cash', 'disabled', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(46, '???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(47, '??? ???? ??????', 'Abu Ghali Motors', 'company', 'cash', 'disabled', 'download.png', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(48, '?????? ??????? ', 'Delta Insurance Company', 'company', 'cash', 'active', 'delta.jpg', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(49, '???? ???? ??? ?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(50, '?????', 'Watheeqa Securities Brokerage Co.', 'company', 'cash', 'disabled', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(51, '???? ???? ???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(52, '???? ???????', 'Amoun Pharmaceuticals', 'company', 'cash', 'disabled', 'amoun.png', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(53, '??? ???', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(54, '???? ????? ????? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(55, '????? ???? ??? ???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(56, '??????? ???????? ????????', 'Advanced Pharmaceutical Packaging Co.', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(57, '???? ????? ??? ?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(58, '???? ???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(59, '??? ?????? ???', 'Mohamed Abd El Mohsen Sheta', 'company', 'cash', 'disabled', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(60, '???? ???', '', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(61, '???? ??????', 'Hussein Segwany', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(62, '???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(63, '???????', 'Travelers', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(64, '????? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(65, '?????? ?????? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(66, '????? ??? ??????', 'Esraa Abd El Fattah', 'company', 'probono', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(67, '?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(68, '??? ??????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(69, '???????', 'Al-Tawfeek for Securities Brokerage', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(70, '????? ????? ???????', '', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(71, '???? ????', 'Sherif Henry', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(72, '???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(73, '???? ??? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(74, '??? ???? ???? ??? ????? ???? ???? ??? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(75, '??????? ????????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(76, '????? ??????? ', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(77, '???? ????????? ??????? ????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(78, '???? ????', 'Manal Hussein', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(79, '????? ?????? ???????? ??????', '', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(80, '???? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(81, '????? ?????', 'Niazi Mostafa', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(82, '??????? ?????', 'Allied Soft', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(83, '????? ??? ????', 'Arabeya Online For Security Brokerage', 'company', 'cash', 'disabled', 'arabeya.jpg', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(84, '????? ????? ??????', 'Vision Media', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(85, '????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(86, '???? ??? ????', 'Rafik Mahfouz Nasr Allah', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(87, '????? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(88, '????????? ????????? ???????', 'Gulf Islamic Investment', 'company', 'cash', 'disabled', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(89, '???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(90, '????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(91, '???? ??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(92, '??? ?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(93, '???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(94, '???? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(95, '????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(96, '???? ???', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(97, '????? ???????', 'Poultry Companies', 'company', 'cash', 'disabled', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(98, '??????', 'Acumen Brokerage', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(99, '?????? ', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(100, '????', 'Bechtel Egypt S.A.E', 'company', 'cash', 'active', 'Bechtel-Egypt-18926-1471864335.png', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(101, '?????? ??? ?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(102, '????? ??????', 'JTI Nakhla', 'company', 'cash', 'disabled', 'jti.jpg', '???? ?????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(103, '????? ??????', 'Employees of Allianz Egypt for insurance', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(104, '??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(105, '???? ????', 'Samah Gohar', 'company', 'probono', 'disabled', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(106, '?????? ??????? ????????? ?? ??? ????? ??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(107, '?????? ??????? ??????', 'Prime Health for Medical services', 'company', 'cash', 'disabled', 'prime.png', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(108, '???? ??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(109, '???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(110, '??????', 'Aqua Tec', 'company', 'cash', 'active', '', '???? ?????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(111, '???????? ??????????? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(112, '??????', 'Faisal K. Adham Group', 'company', 'cash', 'disabled', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(113, '??? ??? ????????', 'Maha Said Zin Al Abdeen', 'company', 'probono', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(114, '???? ???? ???? ???? ', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(115, '???? ????', 'Palm Hills', 'company', 'cash', 'disabled', 'DAKB68fcHpUlKrJHqUXVEkZkiS1w1Edev.jpg', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(116, '??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(117, '???? ???? ??? ???? ?????? ', '', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(118, '???? ????', 'Karim Nagar', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(119, '????? ????', 'Mohamed Osama Ahmed Shawky', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(120, '?????? ??????', 'United Grocers', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(121, '??????? ???', 'Etisalat Misr', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(122, '????? ????', 'Rania Shahat Abd El-Azim Badawi', 'company', 'probono', 'disabled', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(123, '???? ??????? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(124, '??????? ?????? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(125, '??? ?? ??????? ???????', 'HC Securities & Investment', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(126, '???? ???? ?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(127, '?????? ?????? ?????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(128, '???? ?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(129, '?????', 'Darko Contracting Company', 'company', 'cash', 'active', 'download.jpg', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(130, '??????? ???????? ??????? ??????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(131, '???? ', 'PICO International Petroleum - Musharkah', 'company', 'cash', 'active', 'pico.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(132, '????? ??????? ???????? ????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(133, '??????', 'Masters Securities', 'company', 'cash', 'active', 'masters.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(134, '????????', 'Prosylab information & communication systems', 'company', 'probono', 'active', 'prosylab.jpg', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(135, '???????  ????', '', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(136, '??????? ????', 'Shahinaz Nabil Amin Foda', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(137, '???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(138, '??????? ????- ???? ??? ?????? ???', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(139, '???? ??? ?????', 'Hani Sarie-Eldin', 'company', 'probono', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(140, '?????? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(141, '?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(142, '?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(143, '????? ???? ????? (?????)', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(144, '?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(145, '???????', 'Alinma Company for Agricultural Development and Livestock', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(146, '???? ?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(147, '????? ?????', 'Damietta port', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(148, '?? ??? ?? ??????', 'G&D Egypt Services', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(149, '???? ??????', 'A. A. Raafat Al Zoghby', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(150, '????? ??? ?????? Eg-Gate', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(151, '????? ????', 'Hamada Kamal Ahmed (Probono)', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(152, '????? ??????? ???????', 'Hossam El Din Mohamed Elsayed', 'company', 'probono', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(153, '????? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(154, '??? ???????', 'Dar El-Handasa', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(155, '???? ?? ???', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(156, '????? ?????????', 'Bridge Technologies', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(157, '????', 'ERA', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(158, '??????? ?????? Egyptian Direct', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(159, '??? ???????', '', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(160, '?? ??????', 'e-finance', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(161, '??????? ?????? ????? ????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(162, '?????? ?????????', 'Al Ahly for Investments', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(163, '??????', 'Al Rowad Securities', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(164, '????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(165, '???????? ????????', 'Oriental Weavers', 'company', 'cash', 'disabled', 'orienta.jpg', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(166, '??? ????????? ??????', 'NI Capital', 'company', 'cash', 'active', 'ni-capital-logo.png', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(167, '???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(168, '???? ???? ???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(169, '????? ????', 'Wild Green', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(170, '??? ??????', 'Fab Concept', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(171, '????? ????', 'Mostafa Taha Mostafa Shohda', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(172, '???? ????? ?????', 'Hossam El-din Mostafa', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(173, '??? ???', 'Mona Zaki', 'company', 'probono', 'active', 'global.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(174, '?????? ????????? ?????????', 'Pinnacle Construction Projects LTD.', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(175, '?????? ???', 'Gorica Egypt Group Industry S.A.E', 'company', 'cash', 'disabled', 'gorica.jpg', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(176, '?????? ????', 'Barons Court Sports', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(177, '????? ??????? ?????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(178, '????? ????????', 'UAE Embassy', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(179, '?? ?? ?? ?????????? IDP for Chemicals', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(180, '???? ????', 'Bassel Adel', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(181, '????? ??? -??????', 'DP World Sokhna', 'company', 'cash', 'disabled', 'DP world.jpg', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(182, '??????', 'Magnom', 'company', 'cash', 'disabled', 'magnom.png', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(183, '????? ???????', 'Fatema El-Nabawia', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(184, '???? ??????????', 'Ayman Al-Daidamony', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(185, '????? ??????? ?????????', 'International Company for Agricultural Corps', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(186, '???????', 'Hussein El-Rashidy Educational Institution', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(187, '??? ???? ???????', 'Abo Zaabal Fertilizers', 'company', 'cash', 'disabled', 'abo Zabal logo.jpg', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(188, '?????', 'Sigma', 'company', 'cash', 'active', 'download.jpg', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(189, '???? ????', 'Hatem Fahmy', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(190, '??????? ?????? ???? ?????', 'Egyptian Basketball Federation', 'company', 'probono', 'active', 'Logo-EBBFED.png', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(191, '??????? ??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(192, '??????? ????????', 'United Company of Pharmacists', 'company', 'cash', 'disabled', 'UCP.png', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(193, '????? ??????? ????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(194, '???? ???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(195, '???? ???', 'Khaled Hassan', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(196, '??? ?????? ??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(197, '?????? ??????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(198, '????? ???????', 'Mukhtar Ahmed Mohammed Majdali', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(199, '???????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(200, '?????? ???????', 'Egypt Factors', 'company', 'cash', 'disabled', 'Egypt Factors logo.gif', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(201, '???????', 'El Khedewy for Reconstruction and Development', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(202, '???? ????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(203, '?. ??? ?????', 'Dr. Sahar Mokhtar', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(204, '?????? ??????? ??????? ?????????', 'Smart International Education Services', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(205, '???? ???? ?????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(206, '??????? ??????', 'Eastern Company', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(207, '?? ????? ?????? ???', 'J. Walter Thompson', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(208, '??? ?????', 'Omar Seoudi', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(209, '?????', 'Kapci Coatings', 'company', 'cash', 'disabled', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(210, '?????', 'Modern for Satellite Channels', 'company', 'cash', 'active', 'modern.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(211, '??????????? ???????', 'Ismaelia Poultry', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(212, '???????? ???????', 'El Dakhlya Poultry', 'company', 'cash', 'active', 'logo2.png', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(213, '????? ?????? (??? ????)', 'Employees of Allianz Egypt for insurance (Hoda Shawky)', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(214, '???? ???', 'Vicat Egypt for Cement Industry Co.', 'company', 'cash', 'active', 'vicat logo.png', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(215, '?????? ??????', 'Thomson Reuters', 'company', 'cash', 'active', 'ThomsonReuters.png', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(216, '?????????', 'Prometeon Tyre Egypt', 'company', 'cash', 'active', 'logo-prometeon.jpg', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(217, '???? ????', 'Karim Sorour', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(218, '???? ????? ??????', 'Aqua Chiara (M.Karmouty)', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(219, '??????? ?????? ????? ???????', 'Egyptian Volleyball Federation', 'company', 'cash', 'disabled', 'download.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2018-09-08', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(220, '??? ??????? ?????????', 'Misr for educational Administration', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(221, '????????', '', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(222, '????? ???????', 'Potential Clients', 'company', 'cash', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(223, '????? ????', 'Mamdouh Nossair', 'company', 'cash', 'disabled', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2019-03-02', '2020-02-01', '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(224, '??????? ????????', 'Ismail Al Gergawi', 'company', 'cash', 'active', 'Gergawi.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2018-10-09', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(225, '??????? ???????? ???? ????? CAF', 'Conf', 'company', 'cash', 'active', 'caf.jpg', '', NULL, NULL, NULL, NULL, NULL, NULL, '2019-10-02', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(226, '???? ????? ??????????', 'Alexandria Port Authority', 'company', 'cash', 'active', 'Alexandria_Port_Logo.jpg', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(227, '????? ????????', 'Adnan Fathi El Sharkawy', 'company', 'probono', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(228, '????? ??? ????', 'Beni Suef Cement Co.', 'company', 'cash', 'active', 'titan.png', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(229, '?????? ???? ?????', 'Talaat Moustafa Group (TMG)', 'company', 'cash', 'active', 'TMG_Egypt_logo.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2018-11-11', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(230, '???? ??? ????', 'Ahmed Hassan Malek', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(231, '???? ????', 'Rabigh Refining and Petrochemical Company', 'company', 'cash', 'active', 'download.jpg', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(232, '?????', 'Elite Integrated Centers of Excellence', 'company', 'cash', 'active', 'elitelogo_white-01.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2019-01-06', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(233, '??????', 'Franke Kitchen Systems Egypt', 'company', 'cash', 'active', 'download.png', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2019-12-06', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(234, 'M.O.T', 'M.O.T for Investments and Projects', 'company', 'cash', 'active', 'RailLogo.png', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(235, '????? ???????', 'Alex Apparels Co.', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(236, '???? ???? ????', 'Ahmed Essam Samy', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(237, '????? ??? ?????', 'Ihab Sarie El-Din', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(238, '??? ??????', 'MOG For energy', 'company', 'cash', 'active', 'MOG.jpg', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2019-11-09', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(239, '???? ????', 'Mohga Sedeiq', 'company', 'cash', '', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(240, '????? ???????', 'Ihab El-Sewidy', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(241, '??????? ??????? ????????', 'Egypt Kuwait Holding (EKH)', 'company', 'cash', 'active', 'EKH logl.jpg', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2020-06-01', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(242, '???? ??????', 'Majid Al Futtaim', 'company', 'cash', 'active', 'Majid_Al_Futtaim_logo.svg.png', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2020-06-01', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(243, '?????', 'Egyptian Mud Engineering and Chemicals Company (EMEC)', 'company', 'cash', 'active', 'Emec.png', '', NULL, NULL, NULL, NULL, NULL, NULL, '2020-09-02', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(244, '???? ?????? (??? ?????)', 'Faisal Al-Gammal', 'company', 'probono', 'disabled', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '2020-11-02', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(245, '?. ???? ??? ????', 'Dr. Hammad Abdullah', 'company', 'probono', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-02', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(246, '???? ???????', 'Helmi Mickail', 'company', 'cash', 'active', 'download.png', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(247, '???? ???? ????', 'Heirs of Serriah Dawoud', 'company', 'cash', 'disabled', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(248, '???? ???', 'Atef Khellah', 'company', 'cash', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(249, '??? ????????', 'Maha El-Maadawy', 'company', 'probono', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(250, '??????? ??????? ?????? ???????? AIVOC', 'Arab International Vegetable Oils Company (AIVOC)', 'company', 'cash', 'active', 'AIVOC logo.jpg', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2020-12-07', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(251, '???? ?????', 'Akmal Roshdy Kourtam', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(252, '???? ???? ???', 'Sherif Mohamed Ali', 'company', 'cash', 'active', 'tanami.jpg', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(253, '???? ????', 'Hesham Zohair', 'company', 'cash', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(254, '???? ????', 'Fouad Hassib', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '2020-01-11', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(255, '??????', 'Al-Safwa Financial Consultant', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2020-05-11', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(256, '???? ??? ?????? ????', 'Heirs of Abd El-Hamid Balba\'', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(257, '????? ????', 'Ihab Badawy', 'company', 'cash', 'active', '', '?. ???? ??? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(258, '????? ??????', 'Hetero Labs', 'company', 'cash', 'active', 'HETERO_DRUGS_logo.png', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(259, '?????? ??????? ?????????', 'Egyptian Investment Company (EIC)', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(260, '???? ??????', 'Walid El-Selmy', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(261, '?????? ???? ??? ?????', 'Talal Abu-Ghazaleh Global (TAG.Global)', 'company', 'cash', 'active', '', '???? ?????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(262, '???????? ?????????', 'Al Rashdeen Investment LLC', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, '2021-05-04', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(263, '??? ?????', 'Hoda Hedaya', 'company', 'probono', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(264, '??? ???????', 'New Capital Co. for Educational Services', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(265, '?????? ?????????', 'Al-Ratiq for Investment', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(266, '????? ???????? ????? ??? ??????', 'Smart Generation & Smart New Egypt', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(267, '???????', 'El Madain for Construction, Land Development & Real Estate Investment S.A.E.', 'company', 'cash', 'active', 'elmadain-2.jpg', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(268, '???? ??? ??????', 'Sanaa Abd Al Rahman', 'company', 'probono', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(269, '???? ????', 'Hani Gomaa', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(270, '???? ?????', 'Nader El Said Ibrahim El Said', 'company', 'probono', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(271, '??????? ???? ???? ??? ??????', 'Princess Sara Talal Abdel Aziz Al Soud', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(272, '????????? ???????? ???????', 'Kuwaiti Egyptian Investment Company', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(273, '????? ?????????', 'Egyptian Engineers Syndicate', 'company', 'probono', 'disabled', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2021-11-11', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56');
INSERT INTO `clients` (`id`, `client_name_ar`, `client_name_en`, `client_type`, `cash_pro_bono`, `status`, `logo`, `contact_lawyer`, `email`, `phone`, `address_ar`, `address_en`, `notes_ar`, `notes_en`, `client_start_date`, `client_end_date`, `created_at`, `updated_at`) VALUES
(274, '???? ????? ???? ??? ??????', 'Yasser Al-Sayed Mohammed Abdel-Rahman', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, '2022-04-01', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(275, '??????? ?????', 'Al-Noran Sugar Company', 'company', 'probono', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(276, '???? ??????????', 'Alexandria Company - Talat Mostafa Group', 'company', 'cash', 'disabled', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(277, '?????', 'Belton', 'company', 'cash', 'active', '', '**', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(278, '??? ????? ?????', 'Nour El-Din Wahidi', 'company', 'probono', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2022-07-03', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(279, '????  ??????? ????????? ?? ??????? ???????', 'Mena Holding for Investment', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2022-07-03', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(280, '??? ?????? ??? ???? ???????', 'Abd Al-Khaliq Omar Selim Al-Arnous', 'company', 'cash', 'active', '', '???? ???????', NULL, NULL, NULL, NULL, NULL, NULL, '2022-09-03', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(281, '????', 'NSCO Investments INC', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(282, '???????', 'Logistic', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2022-09-06', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(283, '??????? ??????? ??????? ????????', 'Arab International for Tourism and Hotels', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(284, '??? ????? - ???? ????', 'Ice links -Cold Chain', 'company', 'cash', 'active', '', '?. ???? ??? ?????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(285, '???? ???? - ???? ?? ???? ?? ???? ???????', 'Mohammed Fathi- Khalid Ben Assaf Ben Mohammed Al-Awagy', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(286, '???? ???', 'Sami Hassan', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(287, '???????', 'Mirasco', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(288, '???? ??????', 'Mohammed Al-Mawy', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(289, '???? ???????', 'Adel Al-Rashidi', 'company', 'cash', 'active', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, '2023-01-06', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(290, '??????? ????????? ???????', 'Marasina for Tourism', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-11', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(291, '???? ????? ????? ????', 'HERAA CO EL-SAYED MUSTAFA HUSSIEN', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(292, '???? ???????', 'Adel Al-Rashidi', 'company', 'cash', 'disabled', '', '???? ??? ??????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(293, '?????', 'Modad', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(294, '??????', 'Soryal', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(295, '????? ???? ???? ????', 'Farids Ahmed Farid Fouad', 'company', 'probono', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2024-07-05', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(296, '????', 'Cheima', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-06', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(297, '?????? ???? ??????', 'Building Materials Industries Company', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2024-12-06', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(298, '??????? ??????', 'Eastern Company', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(299, '?????? ??? ??????', 'Yassmen Abd Al-Karem', 'company', 'cash', 'active', '', '???? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(300, '???? ???? ??? ?????? ????????', 'Ayman Mohammed Abd Al-Salam Al-Sharkawy', 'company', 'probono', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(301, '???? ??', 'Ahmed Ezz', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(302, '??? ??????', 'Bayt El-Khebra', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-03', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(303, '???? ??? ????', 'Amro Khalaf Mohammed', 'company', 'probono', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(304, 'Egyptian Direct Investment Fund', 'Egyptian Direct Investment Fund', 'company', 'cash', 'active', '', '?. ???? ??? ?????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(305, '???????? ????? ???????', 'Arab Holding Developers', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(306, '???? ??????? ????????', 'Kayan foor real estate develoment', 'company', 'cash', 'active', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(307, '????? ???? ????', 'Seren Maged Mohammed', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(308, '???? ???', 'Nile Wood Co.', 'company', 'cash', 'active', '', '????? ????', NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-09', NULL, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(311, 'Test JSON PUT', 'Sarieldin JSON PUT', 'company', 'cash', 'active', 'client_1758194585_68cbeb99682e7.png', 'ايهاب حمدي', 'info@sarieldin.com', '+20235352424', 'الكيلو 28 طريق القاهرة-الإسكندرية الصحراوي\nالمبنى B19، القرية الذكية - 6 أكتوبر - مصر', 'KM 28 Cairo-Alex Desert Rd.\nB19 Smart Village-6th of October-Egypt', 'ملاحظات بالعربية', 'English notes', '2007-01-01', NULL, '2025-09-18 08:56:45', '2025-09-18 12:02:43'),
(312, '??? ????', 'Test Client', 'company', 'cash', 'active', NULL, 'خالد علي', 'test@example.com', '+20258888522', '????? ????', 'English Address', '??????? ?????', 'English notes', '2025-09-18', NULL, '2025-09-18 09:04:42', '2025-09-18 18:26:21'),
(313, 'Test Database Client', 'Test Database Client', 'individual', 'cash', 'active', NULL, 'علي علي ', NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-18', NULL, '2025-09-18 11:22:00', '2025-09-18 18:24:26'),
(314, 'Test Direct Upload Client', 'Test Direct Upload Client', 'individual', 'cash', 'active', 'client_1758194585_68cbeb99682e7.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-18 11:23:05', '2025-09-18 11:23:05');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact1` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `home_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile_phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fax` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `document_serial` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `case_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_description` text COLLATE utf8mb4_unicode_ci,
  `document_date` date DEFAULT NULL,
  `number_of_pages` int DEFAULT NULL,
  `deposit_date` date DEFAULT NULL,
  `responsible_lawyer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hearings`
--

DROP TABLE IF EXISTS `hearings`;
CREATE TABLE IF NOT EXISTS `hearings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `case_id` int NOT NULL,
  `hearing_date` date NOT NULL,
  `hearing_decision` text COLLATE utf8mb4_unicode_ci,
  `hearing_result` enum('won','lost','postponed','pending') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `last_decision` text COLLATE utf8mb4_unicode_ci,
  `court_notes` text COLLATE utf8mb4_unicode_ci,
  `lawyer_notes` text COLLATE utf8mb4_unicode_ci,
  `expert_notes` text COLLATE utf8mb4_unicode_ci,
  `hearing_duration` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hearing_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `next_hearing` date DEFAULT NULL,
  `short_decision` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hearing_case_id` (`case_id`),
  KEY `idx_hearing_date` (`hearing_date`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hearings`
--

INSERT INTO `hearings` (`id`, `case_id`, `hearing_date`, `hearing_decision`, `hearing_result`, `last_decision`, `court_notes`, `lawyer_notes`, `expert_notes`, `hearing_duration`, `hearing_type`, `next_hearing`, `short_decision`, `created_at`, `updated_at`) VALUES
(2, 1702, '2025-09-20', 'جلسة أولى للقضية', 'pending', NULL, 'ملاحظات المحكمة', 'ملاحظات المحامي', NULL, '2hours', 'initial', NULL, NULL, '2025-09-16 19:16:35', '2025-09-16 19:16:35');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contract_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoice_date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `currency` enum('EGP','USD','EUR') COLLATE utf8mb4_unicode_ci DEFAULT 'EGP',
  `usd_amount` decimal(15,2) DEFAULT NULL,
  `invoice_details` text COLLATE utf8mb4_unicode_ci,
  `invoice_status` enum('draft','sent','paid','overdue','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `invoice_type` enum('service','expenses','advance') COLLATE utf8mb4_unicode_ci DEFAULT 'service',
  `has_vat` tinyint(1) DEFAULT '0',
  `payment_date` date DEFAULT NULL,
  `report_generated` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `idx_invoice_number` (`invoice_number`),
  KEY `idx_invoice_status` (`invoice_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lawyers`
--

DROP TABLE IF EXISTS `lawyers`;
CREATE TABLE IF NOT EXISTS `lawyers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lawyer_name_ar` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lawyer_name_en` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lawyer_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lawyers`
--

INSERT INTO `lawyers` (`id`, `lawyer_name_ar`, `lawyer_name_en`, `lawyer_email`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '????? ????,', ' Ihab Hamdy', 'aabdallah@sarieldin.com; ihamdy@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(2, '???? ?????? ???? ??? ??????', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(3, '???? ?????? ???? ??? ??????? ???? ????', ' Nagy Ramadan, Mohamed Abd El-Aziz, Mo\'men Selim', 'aabdallah@sarieldin.com; nramadan@sarieldin.com; mahafez@sarieldin.com; mselim@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(4, '???? ???????', 'Ahmed Ismail', 'aismail@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(5, '???? ???????', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(6, '???? ????', 'Ahmed Said', 'asaid@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(7, '???? ????,', 'Ahmed Said', 'aabdallah@sarieldin.com; asaid@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(8, '???? ????? ????? ????', 'Ahmed Said, Ihab Hamdy', 'asaid@sarieldin.com; ihamdy@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(9, '???? ????? ???? ????', 'Ahmed Said, Mo\'men Selim', 'asaid@sarieldin.com; mselim@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(10, '???? ???', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(11, '????? ????', 'Ihab Hamdy', 'ihamdy@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(12, '?. ???? ??? ????', 'Dr. Ahmed Abdullah', 'aabdallah@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(13, '?. ???? ??? ?????', 'Dr. Hani Sarie El-Din', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(14, '???? ??? ???????', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(15, '??? ?????? ?????', 'Abd Al-Rahman Al-Bana', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(16, '???? ????', 'Amr Mohammed', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(17, '???? ????', 'Mo\'men Selim', 'mselim@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(18, '???? ????????', 'Moahmed El-Gharably', 'mmagdy@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(19, '???? ????', 'Mohammed Tarek', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(20, '???? ??? ??????', 'Mohamed Abd El-Aziz', 'mahafez@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(21, '???? ??? ??????,', ' Mohamed Abd El-Aziz', 'aabdallah@sarieldin.com; mahafez@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(22, '???? ??? ??????? ???? ???????', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(23, '???? ??? ??????? ???? ????', 'Mohamed Abd El-Aziz, Ahmed Said', 'mahafez@sarieldin.com; asaid@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(24, '???? ??? ??????? ????? ????', 'Mohamed Abd El-Aziz & Ihab Hamdy', 'mahafez@sarieldin.com; ihamdy@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(25, '???? ??? ??????? ???? ????', 'Mohamed Abd El-Aziz & Mo\'men Selim', 'mahafez@sarieldin.com; mselim@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(26, '???? ??? ??????? ???? ????????', 'Mohamed Abd El-Aziz & Moahmed El-Gharably', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(27, '????? ?????', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(28, '??? ???? ????????', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(29, '???? ?????', 'Nagy Ramadan', 'nramadan@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(30, '???? ?????? ???? ????', 'Nagy Ramadan & Ahmed Said', 'nramadan@sarieldin.com; asaid@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(31, '???? ?????? ???? ????', 'Nagy Ramadan & Mo\'men Selim', 'nramadan@sarieldin.com; mselim@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(32, '???? ?????? ???? ??? ??????', 'Nagy Ramadan & Mohamed Abd El-Aziz', 'nramadan@sarieldin.com; mahafez@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(33, '???? ?????? ???? ??? ??????? ???? ????????', 'Nagy Ramadan & Mohamed Abd El-Aziz & Moahmed El-Gharably', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(34, '???? ?????? ????? ????', 'Nagy Ramadan & Mostafa Nassar', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(35, '???? ?????? ????? ????? ???? ????', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(36, '???? ?????? ???? ??????', 'Nagy Ramadan & Hani El-Daly', 'nramadan@sarieldin.com; heldaly@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(37, '??? ?????', '', '', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56'),
(38, '???? ??????', 'Hany El-Daly', 'heldaly@sarieldin.com', 1, '2025-09-16 08:38:56', '2025-09-16 08:38:56');

-- --------------------------------------------------------

--
-- Table structure for table `powers_of_attorney`
--

DROP TABLE IF EXISTS `powers_of_attorney`;
CREATE TABLE IF NOT EXISTS `powers_of_attorney` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `serial_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_capacity` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `power_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `power_letter` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `power_year` year DEFAULT NULL,
  `issuing_authority` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `assigned_lawyers` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number_of_copies` int DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_type` enum('string','number','boolean','json') COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `updated_by` (`updated_by`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `description`, `updated_by`, `updated_at`) VALUES
(1, 'site_name_ar', 'نظام إدارة القضايا القانونية', 'string', 'اسم الموقع باللغة العربية', NULL, '2025-09-16 08:37:16'),
(2, 'site_name_en', 'Litigation Management System', 'string', 'اسم الموقع باللغة الإنجليزية', NULL, '2025-09-16 08:37:16'),
(3, 'default_language', 'ar', 'string', 'اللغة الافتراضية', NULL, '2025-09-16 08:37:16'),
(4, 'currency_default', 'EGP', 'string', 'العملة الافتراضية', NULL, '2025-09-16 08:37:16'),
(5, 'records_per_page', '25', 'number', 'عدد السجلات في كل صفحة', NULL, '2025-09-16 08:37:16'),
(6, 'backup_enabled', 'true', 'boolean', 'تفعيل النسخ الاحتياطي', NULL, '2025-09-16 08:37:16'),
(7, 'email_notifications', 'true', 'boolean', 'تفعيل الإشعارات بالبريد الإلكتروني', NULL, '2025-09-16 08:37:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name_ar` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name_en` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','admin','lawyer','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name_ar`, `full_name_en`, `role`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@litigation.com', '$2y$12$sUtlJmkgM0ux9jKRbU6G4.ROgOWS2Mp2XCCQl1uTJDGBgw38dC15W', 'مدير النظام', 'System Administrator', 'super_admin', 1, '2025-09-19 05:20:16', '2025-09-16 08:37:16', '2025-09-19 05:20:16');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_teams`
--

DROP TABLE IF EXISTS `work_teams`;
CREATE TABLE IF NOT EXISTS `work_teams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `team_name_ar` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `team_description` text COLLATE utf8mb4_unicode_ci,
  `team_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_leader` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cases`
--
ALTER TABLE `cases`
  ADD CONSTRAINT `cases_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cases_ibfk_2` FOREIGN KEY (`work_team_id`) REFERENCES `work_teams` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hearings`
--
ALTER TABLE `hearings`
  ADD CONSTRAINT `hearings_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `powers_of_attorney`
--
ALTER TABLE `powers_of_attorney`
  ADD CONSTRAINT `powers_of_attorney_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD CONSTRAINT `system_settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
