-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 17, 2022 at 09:07 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `workforce_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) UNSIGNED NOT NULL,
  `userId` int(11) UNSIGNED NOT NULL,
  `userName` varchar(100) CHARACTER SET utf8 NOT NULL,
  `announcement_add_date` varchar(30) NOT NULL,
  `subject` varchar(100) CHARACTER SET utf8 NOT NULL,
  `category` varchar(30) CHARACTER SET utf8 NOT NULL,
  `event_date` varchar(30) CHARACTER SET utf8 NOT NULL,
  `event_time` varchar(30) CHARACTER SET utf8 NOT NULL,
  `location` varchar(100) CHARACTER SET utf8 NOT NULL,
  `reminder_expiry_date` varchar(30) CHARACTER SET utf8 NOT NULL,
  `description` varchar(100) CHARACTER SET utf8 NOT NULL,
  `notify_to` varchar(300) CHARACTER SET utf8 NOT NULL,
  `deleted` int(11) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `userId`, `userName`, `announcement_add_date`, `subject`, `category`, `event_date`, `event_time`, `location`, `reminder_expiry_date`, `description`, `notify_to`, `deleted`) VALUES
(4, 240, 'naveenraja', '16 May,2022', 'Given Task Complete', 'Announcement', '2022-05-16T13:20:55.355Z', '10:00', '', '2022-05-16T13:20:55.355Z', 'Hai everyone, Good Morning! Sorry for the delay in completing task. ', 'Hr, team Lead', 0),
(9, 240, 'naveenraja', '16 May,2022', 'sorry for the delay', 'Event', '2022-05-16T14:31:53.853Z', '10:00', 'coimbatore', '2022-05-16T14:31:53.853Z', 'Due to frequent power cuts', 'Hr, Team lead', 0);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) UNSIGNED NOT NULL,
  `event_user_name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `event_id` int(11) NOT NULL,
  `comment` varchar(300) CHARACTER SET utf8 NOT NULL,
  `time` varchar(30) CHARACTER SET utf8 NOT NULL,
  `deleted` int(11) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `event_user_name`, `event_id`, `comment`, `time`, `deleted`) VALUES
(6, 'naveenraja', 9, 'hai hello', '16 May, 2022', 0),
(7, 'naveenraja', 4, 'finished on time', '17 May, 2022', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_name` varchar(60) NOT NULL,
  `password` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `email` varchar(60) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `location` varchar(300) NOT NULL,
  `no_of_employees` varchar(30) NOT NULL,
  `domain_name` varchar(100) NOT NULL,
  `deleted` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 COMMENT '0=False, 1=True'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_name`, `password`, `otp`, `email`, `company_name`, `location`, `no_of_employees`, `domain_name`, `deleted`) VALUES
(1, 'naveenraja309', '$2y$10$N/NQyvTiHfbBSlI9p0zlIuXs1bg7g6gM8dali7R1rsDU3gulMDukS', '', '', '', '', '', '', 0),
(240, 'naveenraja', '$2a$10$xl56wo6tT2KuTfk2FKMy8e0fUNm57kDPphsuBZajlnjLRHnJYgQoi', '0', 'naveenraja.sr@gmail.com', 'evergreen', 'coimbatore', '12', 'hello@intranet.com', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=241;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
