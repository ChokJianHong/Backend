-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2024 at 05:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
(1, 'admin123', 'admin@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwidHlwZSI6ImFkbWluIiwiaWF0IjoxNzE2MjA5MzU3LCJleHAiOjE3MTYyMjczNTd9.3FHOHsP-eIhDqLtQvpn-VwlERD3WLqxZMjk1t_gCXNY');

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `banner_id` int(11) NOT NULL,
  `banner_title` varchar(255) DEFAULT NULL,
  `banner_img` varchar(255) DEFAULT NULL,
  `banner_status` varchar(255) DEFAULT NULL,
  `banner_position` int(10) DEFAULT NULL
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
(1, 'John Doe', 'john@example.com', 'password123', '1234567890', '123 Main St, Cityville', 'undefined', 'Brand C', '2024-12-31', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInR5cGUiOiJjdXN0b21lciIsImlhdCI6MTcxNjExMjc1NCwiZXhwIjoxNzE2MTMwNzU0fQ.e2HQChV-V1iqQEQUZeYWh7PVSvBGDzO5IVqzsimi5Ok'),
(2, 'John Doe', 'alice@example.com', 'securepass', '9876543210', '123 Main St, Cityville', 'undefined', 'Brand C', '2025-06-30', NULL);

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
(9, 1, '2024-05-11', '13:52:53', 'completed', 'motor not working', 'uploads/1715406773626-cream_puff.png', 'uploads/1715406970179-buffet.png', 'standard', 21, NULL, '1234', '123', 'unpaid', 123, '2024-05-12', NULL, 'alarm', '2024-05-11', 1),
(10, 1, '2024-05-11', '13:53:19', 'cancelled', 'asdfgeg', 'uploads/1715406799080-fried_rice.jpeg', NULL, 'urgent', NULL, 'asdf', 'weeadfhdh', NULL, 'unpaid', NULL, NULL, NULL, 'autogate', NULL, 0),
(11, 1, '2024-05-11', '13:53:29', 'completed', 'uykyulkyul', 'uploads/1715406809997-grilled_chicken.jpg', 'uploads/1715532697859-birthday.png', 'emergency', 21, NULL, 'cbvmcbvm', '123', 'unpaid', 123, '2024-05-14', NULL, 'alarm', '2024-05-12', 1),
(12, 1, '2024-05-12', '23:27:04', 'ongoing', 'motor', 'uploads/1715527624172-fried_rice.jpeg', NULL, 'emergency', 21, NULL, '12345', NULL, 'unpaid', 123, '2024-05-14', NULL, 'autogate', NULL, 1),
(13, 1, '2024-05-12', '00:47:41', 'ongoing', 'fasfasfas', 'uploads/1715532461038-mixed_vegetable.png', NULL, 'urgent', 21, NULL, '12412412', NULL, 'unpaid', 123, '2024-05-18', NULL, 'alarm', NULL, 1),
(14, 1, '2024-05-12', '00:47:53', 'cancelled', '6tektkt', 'uploads/1715532473118-chow_mein.jpeg', NULL, 'standard', NULL, 'fgadfgfg', '2412qwarare', NULL, 'unpaid', 123, '2024-05-18', NULL, 'autogate', NULL, 1),
(15, 1, '2024-05-14', '23:54:41', 'ongoing', ',yu,yfu,', 'uploads/1715702081388-autogate.jpeg', NULL, 'standard', 21, NULL, 'uylryuru', NULL, 'unpaid', 1234, '2024-05-17', NULL, 'autogate', NULL, 1),
(16, 1, '2024-05-15', '15:04:11', 'ongoing', 'hjytkrtyk', 'uploads/1715756651178-autogate.jpeg', NULL, 'urgent', 21, NULL, 'xgjdjfgj', NULL, 'unpaid', 1234, '2024-05-16', NULL, 'alarm', NULL, 1),
(17, 1, '2024-05-15', '19:23:24', 'ongoing', 'juymyum', 'uploads/1715772204729-autogate.jpeg', NULL, 'standard', 21, NULL, 'zxcvxcvxc', NULL, 'unpaid', 31234, '2024-05-16', NULL, 'autogate', NULL, 1),
(18, 1, '2024-05-15', '19:36:48', 'ongoing', 'vzcxvxzcv', 'uploads/1715773008546-autogate.jpeg', NULL, 'standard', 21, NULL, 'zxcvzcvxc', NULL, 'unpaid', 1124, '2024-05-17', NULL, 'autogate', NULL, 1),
(19, 1, '2024-05-15', '21:53:45', 'ongoing', 'ymtym', 'uploads/1715781225580-autogate.jpeg', NULL, 'standard', 21, NULL, 'ghmdghm', NULL, 'unpaid', 999, '2024-05-18', NULL, 'autogate', NULL, 1),
(21, 1, '2024-05-15', '23:43:57', 'ongoing', 'jjnvxmvb', 'uploads/1715787837024-autogate.jpeg', NULL, 'urgent', 21, NULL, 'zcvzvm', NULL, 'unpaid', 1, '2024-05-18', NULL, 'alarm', NULL, 1),
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
(37, 1, '2024-05-19', '18:00:52', 'pending', 'iliul', 'uploads/1716112852799-autogate.jpeg', NULL, 'standard', NULL, NULL, 'fjhdgf', NULL, 'unpaid', NULL, NULL, NULL, 'autogate', NULL, 0);

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
(8, 'Motor assembly', '2024-04-17', 'accepted', 2);

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
(21, 'wlison_1994@hotmail.com', 'wilson', '12345', 'autogate', 'asdf', 'free', NULL, '1234', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIxLCJlbWFpbCI6IndsaXNvbl8xOTk0QGhvdG1haWwuY29tIiwidHlwZSI6InRlY2huaWNpYW4iLCJpYXQiOjE3MTYwMTk0MjIsImV4cCI6MTcxNjAzNzQyMn0.9XzFxtpI3fji_dTU3ANmy8Ci67KT6psbaGOcf8CV5-c'),
(22, '101226548@students.swinburne.edu.my', 'dylan', '12345', 'alarm', 'asdf', 'free', NULL, '1241241241', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJlbWFpbCI6IjEwMTIyNjU0OEBzdHVkZW50cy5zd2luYnVybmUuZWR1Lm15IiwidHlwZSI6InRlY2huaWNpYW4iLCJpYXQiOjE3MTU4NDM2NzMsImV4cCI6MTcxNTg2MTY3M30.LjMLm0UO-spMfU4qwVXpkoMqr4OoX0V-2cphh9FC1is'),
(23, 'loweiseng99@gmail.com', 'adam', '12345', 'alarm', 'asdf', 'free', NULL, '1241241241', NULL);

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
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `banner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ordertable`
--
ALTER TABLE `ordertable`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `requestspareparttable`
--
ALTER TABLE `requestspareparttable`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `technician`
--
ALTER TABLE `technician`
  MODIFY `technician_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

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
