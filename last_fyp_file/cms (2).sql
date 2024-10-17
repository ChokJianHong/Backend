-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2024 at 11:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `admin_password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `admin_password`, `email`, `token`) VALUES
(1, '22', 'ad@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNzI2MTk4Nzk2LCJleHAiOjE3MjYyMTY3OTZ9.EvhSidIma8zrIfoWFEZPPADzjr9ZoYq3E4m9ideDZPU'),
(2, '$2a$10$gFnoa9ZZ7chPlliVsqlbYeGPmfjVtd8751ZG1vlKijSP02evq0S8.', 'admin@example.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJ0eXBlIjoiYWRtaW4iLCJpYXQiOjE3MjYxOTk2NjgsImV4cCI6MTcyNjIxNzY2OH0.IfKAQryGMmEWapZNE8mp407oBnHFNXxT8pQEsYYq5tM'),
(3, '$2a$10$0FhcBt7/ZBzln9GTcOzV3us3QB7GFoBXiPX8X2/jLPOJ5LRRkBeXi', 'admin@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNzI5MTUzOTg0LCJleHAiOjE3MjkxNzE5ODR9.fthV8HFljSmIopmFje9YMptkJL58pf97tvXyz-LCv44');

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `banner_id` int(11) NOT NULL,
  `banner_title` varchar(255) DEFAULT NULL,
  `banner_img` varchar(255) DEFAULT NULL,
  `banner_status` varchar(255) DEFAULT NULL,
  `banner_position` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`banner_id`, `banner_title`, `banner_img`, `banner_status`, `banner_position`) VALUES
(1, 'test', 'http://localhost:5005/uploads/1716218354707-Request for service now!.png', 'Display', 1),
(22, 'test 2', 'http://localhost:5005/uploads/1716218637183-banner1.png', 'Display', 2);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `auto_gate_brand` varchar(255) DEFAULT NULL,
  `alarm_brand` varchar(255) DEFAULT NULL,
  `warranty` date DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `name`, `email`, `password`, `phone_number`, `location`, `auto_gate_brand`, `alarm_brand`, `warranty`, `token`) VALUES
(1, 'John Doe', 'john@example.com', 'password123', '1234567890', '123 Main St, Cityville', 'undefined', 'Brand C', '2024-12-31', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInR5cGUiOiJjdXN0b21lciIsImlhdCI6MTcyNjAzMzk1OSwiZXhwIjoxNzI2MDUxOTU5fQ.XxrVoyiM595sSnixtjb1vit-R7UaGXpRMWUfzvifS-w'),
(2, 'John Doe', 'alice@example.com', 'securepass', '9876543210', '123 Main St, Cityville', 'undefined', 'Brand C', '2025-06-30', NULL),
(4, 'imran', 'imran@gmail.com', '$2a$10$EyNoeMYXw3tW.YoTYlAOLewRk3yf9OTxZTmDRwlc1kGG5ZbeDIIXy', '1728879341', 'asdf', NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiaW1yYW5AZ21haWwuY29tIiwidHlwZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzI2MTk3Nzg2LCJleHAiOjE3MjYyMTU3ODZ9.mpSW4NQo_QUvmy8uBPn8JHO4nC1Qgk3-FWktKENw_xY'),
(7, 'zainab', 'zainab@gmail.com', '$2a$10$If1aSlnvaP50IK40Ly5kjO17ANc/TB1p0Wmh7oEfPePBa6XscYIq2', '1', 'k', NULL, NULL, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImVtYWlsIjoiemFpbmFiQGdtYWlsLmNvbSIsInR5cGUiOiJjdXN0b21lciIsImlhdCI6MTcyOTE1Mzk3MiwiZXhwIjoxNzI5MTcxOTcyfQ.QRghbgqVJRvIRHu6_mq28mkTE2PwBoLcNl1yp5YKvGA'),
(101, 'John Doe', 'john.doe@example.com', 'password123', '123-456-7890', 'Location A', 'Brand X', 'Alarm Y', '2024-12-31', 'token123'),
(102, 'Jane Smith', 'jane.smith@example.com', 'password456', '234-567-8901', 'Location B', 'Brand Y', 'Alarm X', '2024-11-30', 'token456'),
(103, 'Bob Johnson', 'bob.johnson@example.com', 'password789', '345-678-9012', 'Location C', 'Brand Z', 'Alarm Z', '2024-10-31', 'token789'),
(104, 'Alice Davis', 'alice.davis@example.com', 'password321', '456-789-0123', 'Location D', 'Brand A', 'Alarm A', '2024-09-30', 'token321'),
(105, 'Michael Lee', 'michael.lee@example.com', 'password654', '567-890-1234', 'Location E', 'Brand B', 'Alarm B', '2024-08-31', 'token654');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `features` varchar(255) NOT NULL,
  `stockAmount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `name`, `image`, `features`, `stockAmount`) VALUES
(11, 'aaa', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Laptop-hard-drive-exposed.jpg/800px-Laptop-hard-drive-exposed.jpg', '[\"asdfasdf\"]', 444),
(15, 'hammer', 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Claw-hammer.jpg', '[\"\"sharp\"\"]', 3),
(16, 'disk', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Laptop-hard-drive-exposed.jpg/800px-Laptop-hard-drive-exposed.jpg', '\"disk 450 ram\"', 22),
(17, 'motherboard', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Intel_DH57DD_Motherboard.jpg/800px-Intel_DH57DD_Motherboard.jpg', '\"strong\"', 11);

-- --------------------------------------------------------

--
-- Table structure for table `ordertable`
--

CREATE TABLE `ordertable` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `order_time` time DEFAULT NULL,
  `order_status` enum('pending','ongoing','completed','cancelled') DEFAULT 'pending',
  `order_detail` varchar(255) DEFAULT NULL,
  `order_img` varchar(255) DEFAULT NULL,
  `order_done_img` varchar(255) DEFAULT NULL,
  `urgency_level` enum('standard','urgent','emergency') DEFAULT NULL,
  `technician_id` int(11) DEFAULT NULL,
  `cancel_details` varchar(255) DEFAULT NULL,
  `location_details` varchar(255) DEFAULT NULL,
  `price_details` varchar(255) DEFAULT NULL,
  `price_status` enum('paid','unpaid') DEFAULT 'unpaid',
  `total_price` int(11) DEFAULT NULL,
  `technician_eta` date DEFAULT NULL,
  `event_id` varchar(255) DEFAULT NULL,
  `problem_type` enum('alarm','autogate') DEFAULT NULL,
  `order_done_date` date DEFAULT NULL,
  `accept` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ordertable`
--

INSERT INTO `ordertable` (`order_id`, `customer_id`, `order_date`, `order_time`, `order_status`, `order_detail`, `order_img`, `order_done_img`, `urgency_level`, `technician_id`, `cancel_details`, `location_details`, `price_details`, `price_status`, `total_price`, `technician_eta`, `event_id`, `problem_type`, `order_done_date`, `accept`) VALUES
(11, 1, '2024-07-11', '13:53:29', 'completed', 'uykyulkyul', 'uploads/1715406809997-grilled_chicken.jpg', 'uploads/1715532697859-birthday.png', 'emergency', 21, NULL, 'cbvmcbvm', '123', 'unpaid', 123, '2024-05-14', NULL, 'alarm', '2024-05-12', 1),
(12, 1, '2024-08-15', '23:27:04', 'cancelled', 'motor', 'uploads/1715527624172-fried_rice.jpeg', NULL, 'emergency', NULL, 'jhj', '12345', NULL, 'unpaid', 123, '2024-05-14', NULL, 'autogate', NULL, 1),
(13, 1, '2024-05-12', '00:47:41', 'ongoing', 'fasfasfas', 'uploads/1715532461038-mixed_vegetable.png', NULL, 'urgent', 21, NULL, '12412412', NULL, 'unpaid', 123, '2024-05-18', NULL, 'alarm', NULL, 1),
(14, 1, '2024-05-12', '00:47:53', 'cancelled', '6tektkt', 'uploads/1715532473118-chow_mein.jpeg', NULL, 'standard', NULL, 'fgadfgfg', '2412qwarare', NULL, 'unpaid', 123, '2024-05-18', NULL, 'autogate', NULL, 1),
(15, 1, '2024-05-14', '23:54:41', 'cancelled', ',yu,yfu,', 'uploads/1715702081388-autogate.jpeg', NULL, 'standard', NULL, 'sjdfd', 'uylryuru', NULL, 'unpaid', 1234, '2024-05-17', NULL, 'autogate', NULL, 1),
(16, 1, '2024-05-15', '15:04:11', 'ongoing', 'hjytkrtyk', 'uploads/1715756651178-autogate.jpeg', NULL, 'urgent', 21, NULL, 'xgjdjfgj', NULL, 'unpaid', 1234, '2024-05-16', NULL, 'alarm', NULL, 1),
(17, 1, '2024-05-15', '19:23:24', 'completed', 'juymyum', 'uploads/1715772204729-autogate.jpeg', NULL, 'standard', 21, NULL, 'zxcvxcvxc', NULL, 'unpaid', 31234, '2024-05-16', NULL, 'autogate', NULL, 1),
(18, 1, '2024-05-15', '19:36:48', 'ongoing', 'vzcxvxzcv', 'uploads/1715773008546-autogate.jpeg', NULL, 'standard', 21, NULL, 'zxcvzcvxc', NULL, 'unpaid', 1124, '2024-05-17', NULL, 'autogate', NULL, 1),
(19, 1, '2024-05-15', '21:53:45', 'cancelled', 'ymtym', 'uploads/1715781225580-autogate.jpeg', NULL, 'standard', 21, NULL, 'ghmdghm', NULL, 'unpaid', 999, '2024-05-18', NULL, 'autogate', NULL, 1),
(21, 1, '2024-05-15', '23:43:57', 'completed', 'jjnvxmvb', 'uploads/1715787837024-autogate.jpeg', 'uploads/1726034132875-Attachment_1725964260.jpeg', 'urgent', 21, NULL, 'zcvzvm', '320', 'unpaid', 1, '2024-05-18', NULL, 'alarm', '2024-09-11', 1),
(23, 1, '2024-05-15', '23:48:47', 'cancelled', 'mgdhmhgm', 'uploads/1715788127749-autogate.jpeg', NULL, 'standard', NULL, 'dasdgdg', 'vbxvmb', NULL, 'unpaid', 123123, '2024-05-17', NULL, 'autogate', NULL, 1),
(24, 1, '2024-05-15', '00:18:50', 'cancelled', 'bsndfgn', 'uploads/1715789930397-autogate.jpeg', NULL, 'emergency', NULL, 'dasdad', 'zxcbcbz', NULL, 'unpaid', 41241, '2024-05-18', NULL, 'alarm', NULL, 1),
(25, 1, '2024-05-15', '01:17:45', 'cancelled', 'fadhfdh', 'uploads/1715793465380-autogate.jpeg', NULL, 'standard', NULL, 'ads', 'zcxbzxcb', NULL, 'unpaid', 125351, '2024-05-17', NULL, 'autogate', NULL, 1),
(26, 1, '2024-05-15', '01:30:54', 'cancelled', 'ulful', 'uploads/1715794254228-autogate.jpeg', NULL, 'standard', NULL, 'gdfgsdg', 'dfhldkhl', NULL, 'unpaid', 123, '2024-05-17', NULL, 'autogate', NULL, 1),
(27, 1, '2024-05-15', '01:39:58', 'cancelled', 'adsfadf', 'uploads/1715794798544-autogate.jpeg', NULL, 'standard', NULL, 'rhrehrh', 'zxcvzxcv', NULL, 'unpaid', 412412, '2024-05-18', NULL, 'autogate', NULL, 1),
(28, 1, '2024-05-15', '01:45:32', 'cancelled', 'nbgfsngf', 'uploads/1715795132433-autogate.jpeg', NULL, 'standard', NULL, 'bfdsbfdb', 'zcbzcxbxc', NULL, 'unpaid', 123, '2024-05-17', 'j1apmkebarphaeg5fo72n6pqt4', 'autogate', NULL, 1),
(29, 1, '2024-05-15', '04:18:02', 'cancelled', 'rtann', 'uploads/1715804282854-autogate.jpeg', NULL, 'standard', NULL, 'safcasf', 'afnfdn', NULL, 'unpaid', 124, '2024-05-18', 'v4jcl9q5uv6o9h54rp7tgc0ck4', 'autogate', NULL, 1),
(30, 1, '2024-05-16', '11:21:33', 'ongoing', 'fdabdfb', 'uploads/1715829692996-autogate.jpeg', NULL, 'standard', 21, NULL, 'zcxvzxcvzc', NULL, 'unpaid', 12312, '2024-05-17', NULL, 'autogate', NULL, 1),
(31, 1, '2024-05-16', '12:38:33', 'cancelled', 'gsvxcv', 'uploads/1715834313760-autogate.jpeg', NULL, 'urgent', NULL, 'assfvas', 'zxbcbzxcb', NULL, 'unpaid', 15, '2024-05-17', 'jmk9pa5v5msv0hv8v5q4g1s0ak', 'autogate', NULL, 1),
(32, 1, '2024-05-16', '13:26:03', 'cancelled', 'dfdfhdfh', 'uploads/1715837163409-autogate.jpeg', NULL, 'emergency', NULL, 'gwegeg', 'zxczxczxc', NULL, 'unpaid', 12345, '2024-05-18', '91qfrhtvh8ktm9k4ce99s0ocmc', 'autogate', NULL, 1),
(33, 1, '2024-05-16', '13:59:10', 'cancelled', 'dasgfdfg', 'uploads/1715839150523-autogate.jpeg', NULL, 'standard', NULL, 'dgadg', 'zbcbczbzc', NULL, 'unpaid', 12324, '2024-05-17', 'vispqf8ds6rqjjm7be434qoio0', 'autogate', NULL, 1),
(34, 1, '2024-05-16', '14:32:17', 'cancelled', 'htrhth', 'uploads/1715841137378-autogate.jpeg', NULL, 'standard', NULL, 'asdfg', 'xcncvncxvn', NULL, 'unpaid', 1234, '2024-05-17', 'cktpvsf6r1fp98ngruha14dr7o', 'autogate', NULL, 1),
(35, 1, '2024-05-16', '15:13:24', 'completed', 'htrwhtrh', 'uploads/1715843604872-autogate.jpeg', 'uploads/1715843707538-autogate.jpeg', 'standard', 22, NULL, 'xchcvhcvhxcvh', '151325', 'unpaid', 14124, '2024-05-17', 'k79mno0htk9u45l85ngtogsae4', 'autogate', '2024-05-16', 1),
(36, 1, '2024-05-16', '15:46:11', 'cancelled', 'ulyuly', 'uploads/1715845571449-autogate.jpeg', NULL, 'standard', NULL, 'dgsdg', 'rheraher', NULL, 'unpaid', 4, '2024-05-19', 'rhhrfi0a352bfn3v132ntic4io', 'autogate', NULL, 1),
(37, 1, '2024-05-19', '18:00:52', 'ongoing', 'iliul', 'uploads/1716112852799-autogate.jpeg', NULL, 'standard', 21, NULL, 'fjhdgf', NULL, 'unpaid', NULL, NULL, NULL, 'autogate', NULL, 0),
(38, 1, '2024-09-11', '22:53:02', 'cancelled', 'autogate issue', 'uploads/1726033982550-Attachment_1725964260.jpeg', NULL, 'emergency', NULL, 't', 'dhakea', NULL, 'unpaid', NULL, NULL, NULL, 'autogate', NULL, 0),
(39, 1, '2024-09-11', '22:53:32', 'ongoing', 'alarm issue', 'uploads/1726034012675-Attachment_1725964260.jpeg', NULL, 'emergency', 21, NULL, ' dhaka', NULL, 'unpaid', 343, '2024-09-19', NULL, 'alarm', NULL, 1),
(42, 7, '2024-10-11', '09:52:28', 'completed', 'testing', 'uploads/1728611548324-DATA.jpg', 'uploads/1728695658815-DATA1.jpg', 'emergency', 24, NULL, 't', '500', 'unpaid', 3000, '2024-11-21', NULL, 'autogate', '2024-10-12', 1),
(43, 7, '2024-10-11', '09:53:00', 'completed', 'tt', 'uploads/1728611580371-WhatsApp Image 2024-10-05 at 17.25.39_9bdc9f84.jpg', 'uploads/1728695712127-DATA.jpg', 'urgent', 24, NULL, 't', '700', 'unpaid', 5000, '2024-12-20', 'k0ele3hgb7h3qo0e449njpdec4', 'alarm', '2024-10-12', 1),
(44, 7, '2024-10-12', '09:11:19', 'pending', 'test purpose', 'uploads/1728695479126-s2.jpg', NULL, 'standard', NULL, NULL, 'swinburne', NULL, 'unpaid', NULL, NULL, NULL, 'autogate', NULL, 0),
(46, 7, '2024-10-12', '09:12:00', 'ongoing', 'tttt', 'uploads/1728695520779-WhatsApp Image 2024-09-24 at 18.15.28_9c615565.jpg', NULL, 'standard', 24, NULL, 'uss', NULL, 'unpaid', NULL, NULL, NULL, 'alarm', NULL, 0),
(47, 7, '2024-10-12', '09:12:15', 'pending', 'tt', 'uploads/1728695535150-DATA.jpg', NULL, 'standard', NULL, NULL, 't', NULL, 'unpaid', NULL, NULL, NULL, 'autogate', NULL, 0),
(77, 101, '2024-01-15', '10:30:00', 'completed', 'Fix alarm system', 'img1.jpg', 'done_img1.jpg', 'standard', 1, NULL, 'Location A', 'Paid in cash', 'paid', 200, NULL, NULL, NULL, '2024-01-20', 0),
(78, 102, '2024-02-18', '11:00:00', 'completed', 'Fix autogate', 'img2.jpg', 'done_img2.jpg', 'urgent', 2, NULL, 'Location B', 'Credit card', 'paid', 250, NULL, NULL, NULL, '2024-02-22', 0),
(79, 103, '2024-03-12', '14:15:00', 'completed', 'Repair alarm panel', 'img3.jpg', 'done_img3.jpg', 'emergency', 3, NULL, 'Location C', 'Bank transfer', 'paid', 300, NULL, NULL, NULL, '2024-03-15', 0),
(80, 104, '2024-04-10', '09:45:00', 'completed', 'Replace autogate motor', 'img4.jpg', 'done_img4.jpg', 'standard', 1, NULL, 'Location D', 'Paid in cash', 'paid', 350, NULL, NULL, NULL, '2024-04-14', 0),
(81, 105, '2024-05-05', '16:00:00', 'completed', 'Install new alarm', 'img5.jpg', 'done_img5.jpg', 'urgent', 4, NULL, 'Location E', 'Credit card', 'paid', 400, NULL, NULL, NULL, '2024-05-09', 0),
(82, 102, '2024-01-20', '15:00:00', 'completed', 'Install new autogate', 'img6.jpg', 'done_img6.jpg', 'standard', 2, NULL, 'Location B', 'Paid in cash', 'paid', 300, NULL, NULL, NULL, '2024-01-25', 0),
(83, 101, '2024-02-25', '12:30:00', 'completed', 'Routine maintenance on alarm', 'img7.jpg', 'done_img7.jpg', 'urgent', 1, NULL, 'Location A', 'Credit card', 'paid', 150, NULL, NULL, NULL, '2024-03-01', 0),
(84, 104, '2024-03-10', '11:00:00', 'completed', 'Upgrade alarm system', 'img8.jpg', 'done_img8.jpg', 'emergency', 1, NULL, 'Location D', 'Bank transfer', 'paid', 450, NULL, NULL, NULL, '2024-03-15', 0),
(85, 103, '2024-04-15', '09:00:00', 'completed', 'Install new sensors', 'img9.jpg', 'done_img9.jpg', 'standard', 3, NULL, 'Location C', 'Paid in cash', 'paid', 200, NULL, NULL, NULL, '2024-04-20', 0),
(86, 105, '2024-05-10', '14:45:00', 'completed', 'Replace old autogate', 'img10.jpg', 'done_img10.jpg', 'urgent', 5, NULL, 'Location E', 'Credit card', 'paid', 350, NULL, NULL, NULL, '2024-05-15', 0),
(87, 101, '2024-06-05', '08:30:00', 'completed', 'Repair alarm remote', 'img11.jpg', 'done_img11.jpg', 'standard', 1, NULL, 'Location A', 'Bank transfer', 'paid', 100, NULL, NULL, NULL, '2024-06-10', 0),
(88, 102, '2024-07-20', '10:00:00', 'completed', 'Install battery backup for autogate', 'img12.jpg', 'done_img12.jpg', 'emergency', 2, NULL, 'Location B', 'Paid in cash', 'paid', 250, NULL, NULL, NULL, '2024-07-25', 0),
(92, 101, '2024-02-01', '10:00:00', 'completed', 'Fix alarm system', 'img16.jpg', 'done_img16.jpg', 'standard', 1, NULL, 'Location A', 'Paid in cash', 'paid', 220, NULL, NULL, NULL, '2024-02-05', 0),
(93, 102, '2024-02-05', '11:30:00', 'completed', 'Install new sensors', 'img17.jpg', 'done_img17.jpg', 'urgent', 2, NULL, 'Location B', 'Credit card', 'paid', 180, NULL, NULL, NULL, '2024-02-10', 0),
(94, 101, '2024-02-15', '12:45:00', 'completed', 'Repair alarm remote', 'img18.jpg', 'done_img18.jpg', 'standard', 1, NULL, 'Location A', 'Bank transfer', 'paid', 150, NULL, NULL, NULL, '2024-02-20', 0),
(95, 103, '2024-03-03', '09:15:00', 'completed', 'Upgrade alarm system', 'img19.jpg', 'done_img19.jpg', 'urgent', 3, NULL, 'Location C', 'Paid in cash', 'paid', 300, NULL, NULL, NULL, '2024-03-08', 0),
(96, 104, '2024-03-12', '14:00:00', 'completed', 'Routine maintenance on autogate', 'img20.jpg', 'done_img20.jpg', 'standard', 1, NULL, 'Location D', 'Credit card', 'paid', 250, NULL, NULL, NULL, '2024-03-16', 0),
(97, 105, '2024-03-20', '15:30:00', 'completed', 'Replace autogate motor', 'img21.jpg', 'done_img21.jpg', 'emergency', 5, NULL, 'Location E', 'Bank transfer', 'paid', 320, NULL, NULL, NULL, '2024-03-25', 0),
(98, 101, '2024-04-05', '11:00:00', 'completed', 'Fix connectivity issues with alarm', 'img22.jpg', 'done_img22.jpg', 'standard', 1, NULL, 'Location A', 'Paid in cash', 'paid', 220, NULL, NULL, NULL, '2024-04-10', 0),
(99, 102, '2024-04-10', '09:30:00', 'completed', 'Install new battery for alarm', 'img23.jpg', 'done_img23.jpg', 'urgent', 2, NULL, 'Location B', 'Credit card', 'paid', 180, NULL, NULL, NULL, '2024-04-15', 0),
(100, 103, '2024-04-20', '14:45:00', 'completed', 'Routine check on autogate', 'img24.jpg', 'done_img24.jpg', 'standard', 3, NULL, 'Location C', 'Bank transfer', 'paid', 150, NULL, NULL, NULL, '2024-04-25', 0),
(101, 104, '2024-05-10', '10:15:00', 'completed', 'Upgrade autogate software', 'img25.jpg', 'done_img25.jpg', 'emergency', 1, NULL, 'Location D', 'Paid in cash', 'paid', 300, NULL, NULL, NULL, '2024-05-15', 0),
(102, 105, '2024-05-18', '15:30:00', 'completed', 'Replace alarm panel', 'img26.jpg', 'done_img26.jpg', 'standard', 5, NULL, 'Location E', 'Credit card', 'paid', 400, NULL, NULL, NULL, '2024-05-23', 0),
(103, 101, '2024-06-15', '12:00:00', 'completed', 'Install new alarm system', 'img27.jpg', 'done_img27.jpg', 'urgent', 1, NULL, 'Location A', 'Bank transfer', 'paid', 250, NULL, NULL, NULL, '2024-06-20', 0),
(104, 102, '2024-06-25', '14:00:00', 'completed', 'Fix wiring issues with autogate', 'img28.jpg', 'done_img28.jpg', 'standard', 2, NULL, 'Location B', 'Paid in cash', 'paid', 180, NULL, NULL, NULL, '2024-06-30', 0),
(105, 103, '2024-07-05', '09:00:00', 'completed', 'Install new sensors for alarm', 'img29.jpg', 'done_img29.jpg', 'emergency', 3, NULL, 'Location C', 'Credit card', 'paid', 350, NULL, NULL, NULL, '2024-07-10', 0),
(106, 104, '2024-07-15', '11:30:00', 'completed', 'Check battery life on autogate', 'img30.jpg', 'done_img30.jpg', 'standard', 1, NULL, 'Location D', 'Bank transfer', 'paid', 150, NULL, NULL, NULL, '2024-07-20', 0),
(107, 105, '2024-08-10', '16:45:00', 'completed', 'Routine maintenance on alarm', 'img31.jpg', 'done_img31.jpg', 'urgent', 5, NULL, 'Location E', 'Paid in cash', 'paid', 220, NULL, NULL, NULL, '2024-08-15', 0),
(108, 101, '2024-08-25', '13:00:00', 'completed', 'Replace sensors on autogate', 'img32.jpg', 'done_img32.jpg', 'standard', 1, NULL, 'Location A', 'Credit card', 'paid', 200, NULL, NULL, NULL, '2024-08-30', 0),
(109, 102, '2024-09-05', '10:30:00', 'completed', 'Upgrade alarm system', 'img33.jpg', 'done_img33.jpg', 'emergency', 2, NULL, 'Location B', 'Bank transfer', 'paid', 300, NULL, NULL, NULL, '2024-09-10', 0),
(110, 103, '2024-09-15', '12:30:00', 'completed', 'Install new autogate remote', 'img34.jpg', 'done_img34.jpg', 'standard', 3, NULL, 'Location C', 'Paid in cash', 'paid', 180, NULL, NULL, NULL, '2024-09-20', 0),
(111, 101, '2024-08-02', '10:30:00', 'completed', 'Install new sensors for alarm', 'img35.jpg', 'done_img35.jpg', 'urgent', 1, NULL, 'Location A', 'Paid in cash', 'paid', 250, NULL, NULL, NULL, '2024-08-05', 0),
(112, 102, '2024-08-05', '12:00:00', 'completed', 'Fix alarm siren', 'img36.jpg', 'done_img36.jpg', 'standard', 2, NULL, 'Location B', 'Credit card', 'paid', 20000, NULL, NULL, NULL, '2024-08-10', 0),
(113, 101, '2024-08-10', '09:15:00', 'completed', 'Routine maintenance for autogate', 'img37.jpg', 'done_img37.jpg', 'standard', 1, NULL, 'Location A', 'Bank transfer', 'paid', 200, NULL, NULL, NULL, '2024-08-12', 0),
(114, 103, '2024-08-12', '14:30:00', 'completed', 'Upgrade alarm control panel', 'img38.jpg', 'done_img38.jpg', 'urgent', 3, NULL, 'Location C', 'Paid in cash', 'paid', 300, NULL, NULL, NULL, '2024-08-15', 0),
(115, 104, '2024-08-15', '11:00:00', 'completed', 'Check battery of autogate', 'img39.jpg', 'done_img39.jpg', 'standard', 1, NULL, 'Location D', 'Credit card', 'paid', 150, NULL, NULL, NULL, '2024-08-18', 0),
(116, 105, '2024-08-22', '15:30:00', 'completed', 'Install new camera system', 'img40.jpg', 'done_img40.jpg', 'emergency', 5, NULL, 'Location E', 'Bank transfer', 'paid', 400, NULL, NULL, NULL, '2024-08-25', 0),
(117, 102, '2024-08-28', '10:45:00', 'completed', 'Replace alarm batteries', 'img41.jpg', 'done_img41.jpg', 'standard', 2, NULL, 'Location B', 'Paid in cash', 'paid', 100, NULL, NULL, NULL, '2024-08-30', 0);

-- --------------------------------------------------------

--
-- Table structure for table `requestspareparttable`
--

CREATE TABLE `requestspareparttable` (
  `request_id` int(11) NOT NULL,
  `spare_part` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('pending','accepted','decline') DEFAULT 'pending',
  `technician_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requestspareparttable`
--

INSERT INTO `requestspareparttable` (`request_id`, `spare_part`, `date`, `status`, `technician_id`) VALUES
(7, 'Battery pack', '2024-04-16', 'accepted', 1),
(8, 'Motor assembly', '2024-04-17', 'accepted', 2),
(10, 'Brake Pads', '2024-10-02', 'accepted', 2),
(11, 'Brake Pads', '2024-10-03', 'decline', 1),
(12, 'Oil Filter', '2024-10-01', 'pending', 2),
(13, 'Oil Filter', '2024-10-02', 'accepted', 3),
(14, 'Oil Filter', '2024-10-03', 'pending', 1),
(15, 'Air Filter', '2024-10-01', 'decline', 2),
(16, 'Air Filter', '2024-10-02', 'pending', 1),
(17, 'Air Filter', '2024-10-03', 'accepted', 3);

-- --------------------------------------------------------

--
-- Table structure for table `request_forms`
--

CREATE TABLE `request_forms` (
  `id` int(11) NOT NULL,
  `technician_name` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `equipment` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `parts_needed` text NOT NULL,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_forms`
--

INSERT INTO `request_forms` (`id`, `technician_name`, `customer_name`, `equipment`, `brand`, `parts_needed`, `status`, `created_at`) VALUES
(2, 'John Doe', 'Jane Smith', 'Air Conditioner', 'LG', 'Compressor, Fan Motor', 'pending', '2024-09-11 13:30:40'),
(3, 'John Doe', 'Jane Smith', 'Air Conditioner', 'LG', 'Compressor, Fan Motor', 'complete', '2024-09-11 13:32:20'),
(4, 'wlison_1994@hotmail.com', 'Jhon', 'asdf', 'asdf', 'asdf', 'complete', '2024-09-11 13:34:04'),
(5, 'wlison_1994@hotmail.com', 'Jhon', 'asdf', 'asdf', 'asdf', 'pending', '2024-09-11 13:35:01'),
(6, 'wlison_1994@hotmail.com', '32', 'asdf', 'asdf', '3w', 'pending', '2024-09-11 13:47:20'),
(8, 'wlison_1994@hotmail.com', 'Jhon', 'Air Conditioner', 'LG', 'yuuyu', 'pending', '2024-09-12 04:24:14'),
(9, 'newtech@example.com', 'Jane Smith', 'Air Conditioner', 'LG', 'Cooling Fan', 'pending', '2024-09-13 05:09:39'),
(10, 'zain@gmail.com', 'eman', 'remote', 'sumsung', '2018', 'pending', '2024-10-15 15:17:12');

-- --------------------------------------------------------

--
-- Table structure for table `technician`
--

CREATE TABLE `technician` (
  `technician_id` int(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `specialization` enum('alarm','autogate') DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('working','free') DEFAULT 'free',
  `ongoing_order_id` int(11) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `technician`
--

INSERT INTO `technician` (`technician_id`, `email`, `name`, `password`, `specialization`, `location`, `status`, `ongoing_order_id`, `phone_number`, `token`) VALUES
(1, 'technician1@example.com', 'Technician One', 'techpassword1', 'alarm', 'Location A', 'free', NULL, '123-456-7890', 'token1'),
(2, 'technician2@example.com', 'Technician Two', 'techpassword2', 'autogate', 'Location B', 'free', NULL, '234-567-8901', 'token2'),
(3, 'technician3@example.com', 'Technician Three', 'techpassword3', 'alarm', 'Location C', 'free', NULL, '345-678-9012', 'token3'),
(4, 'technician4@example.com', 'Technician Four', 'techpassword4', 'autogate', 'Location D', 'free', NULL, '456-789-0123', 'token4'),
(5, 'technician5@example.com', 'Technician Five', 'techpassword5', 'alarm', 'Location E', 'free', NULL, '567-890-1234', 'token5'),
(21, 'wlison_1994@hotmail.com', 'wilson', '12345', 'autogate', 'asdf', 'free', NULL, '1234', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIxLCJlbWFpbCI6IndsaXNvbl8xOTk0QGhvdG1haWwuY29tIiwidHlwZSI6InRlY2huaWNpYW4iLCJpYXQiOjE3MjYxMTQ5OTQsImV4cCI6MTcyNjEzMjk5NH0.-nfamQIpVEMtkI6TdtcuS6eWBtUY6Xa-LRH4pULMY2s'),
(22, '101226548@students.swinburne.edu.my', 'dylan', '12345', 'alarm', 'asdf', 'free', NULL, '1241241241', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJlbWFpbCI6IjEwMTIyNjU0OEBzdHVkZW50cy5zd2luYnVybmUuZWR1Lm15IiwidHlwZSI6InRlY2huaWNpYW4iLCJpYXQiOjE3MTU4NDM2NzMsImV4cCI6MTcxNTg2MTY3M30.LjMLm0UO-spMfU4qwVXpkoMqr4OoX0V-2cphh9FC1is'),
(23, 'loweiseng99@gmail.com', 'adam', '12345', 'alarm', 'asdf', 'free', NULL, '1241241241', NULL),
(24, 'zain@gmail.com', 'zain', '$2a$10$4iyZB9KtbPTZBy/kGOfr3.rxYxMspFteVa0Lmsgz.N9O5L7/LZ8D2', 'alarm', 'k', 'free', NULL, '1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI0LCJlbWFpbCI6InphaW5AZ21haWwuY29tIiwidHlwZSI6InRlY2huaWNpYW4iLCJpYXQiOjE3MjkxNTM5NDksImV4cCI6MTcyOTE3MTk0OX0.JsBP5PhBaNsOeCnLsPidURfz8wja4-WNOw6VG7zrewg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`banner_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ordertable`
--
ALTER TABLE `ordertable`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_customer_id` (`customer_id`),
  ADD KEY `fk_technician_id` (`technician_id`);

--
-- Indexes for table `requestspareparttable`
--
ALTER TABLE `requestspareparttable`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `technician_id` (`technician_id`);

--
-- Indexes for table `request_forms`
--
ALTER TABLE `request_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `technician`
--
ALTER TABLE `technician`
  ADD PRIMARY KEY (`technician_id`),
  ADD KEY `ongoing_order_id` (`ongoing_order_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `banner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `ordertable`
--
ALTER TABLE `ordertable`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `requestspareparttable`
--
ALTER TABLE `requestspareparttable`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `request_forms`
--
ALTER TABLE `request_forms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `technician`
--
ALTER TABLE `technician`
  MODIFY `technician_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ordertable`
--
ALTER TABLE `ordertable`
  ADD CONSTRAINT `fk_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_technician_id` FOREIGN KEY (`technician_id`) REFERENCES `technician` (`technician_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
