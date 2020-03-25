-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2020 at 01:18 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbmaster`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `_id` int(11) UNSIGNED NOT NULL,
  `id_user` int(11) UNSIGNED NOT NULL,
  `id_item` int(11) UNSIGNED NOT NULL,
  `name_item` varchar(60) NOT NULL,
  `total_items` int(11) UNSIGNED DEFAULT '0',
  `total_price` decimal(10,2) UNSIGNED NOT NULL,
  `is_check_out` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`_id`, `id_user`, `id_item`, `name_item`, `total_items`, `total_price`, `is_check_out`, `created_at`, `updated_at`) VALUES
(1, 5, 4, 'SUPER SUPREME', 1, '86000.00', 1, '2020-03-19 14:00:50', '2020-03-20 16:37:07'),
(2, 5, 1, 'Cheesy Galore', 1, '76000.00', 1, '2020-03-20 16:36:36', '2020-03-20 16:37:07'),
(5, 6, 1, 'Cheesy Galore', 1, '76000.00', 1, '2020-03-23 02:45:19', '2020-03-23 02:46:04'),
(6, 6, 1, 'Cheesy Galore', 1, '76000.00', 1, '2020-03-23 02:46:22', '2020-03-23 02:46:30'),
(7, 6, 1, 'Cheesy Galore', 1, '76000.00', 1, '2020-03-23 02:54:29', '2020-03-23 02:54:36'),
(8, 6, 12, 'Bucket Drummer Stick', 3, '294000.00', 1, '2020-03-23 10:03:38', '2020-03-23 10:04:50'),
(9, 6, 1, 'Cheesy Galore', 1, '76000.00', 0, '2020-03-23 10:26:12', '2020-03-23 10:26:27');

-- --------------------------------------------------------

--
-- Table structure for table `itemcategories`
--

CREATE TABLE `itemcategories` (
  `_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `itemcategories`
--

INSERT INTO `itemcategories` (`_id`, `name`) VALUES
(6, 'Chikken KFC'),
(7, 'Donnut J.CO'),
(8, 'Coffee Starbucks'),
(9, 'Pizza PH'),
(10, 'Burger McD');

-- --------------------------------------------------------

--
-- Table structure for table `itemreviews`
--

CREATE TABLE `itemreviews` (
  `_id` int(11) UNSIGNED NOT NULL,
  `id_user` int(11) UNSIGNED DEFAULT '0',
  `id_item` int(11) UNSIGNED DEFAULT '0',
  `rating` tinyint(1) UNSIGNED DEFAULT '0',
  `review` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `_id` int(11) UNSIGNED NOT NULL,
  `id_restaurant` int(11) UNSIGNED NOT NULL,
  `id_category` int(11) UNSIGNED DEFAULT '0',
  `name` varchar(60) NOT NULL,
  `price` decimal(10,2) UNSIGNED NOT NULL,
  `quantity` int(11) UNSIGNED DEFAULT '0',
  `description` text,
  `images` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`_id`, `id_restaurant`, `id_category`, `name`, `price`, `quantity`, `description`, `images`, `created_at`, `updated_at`) VALUES
(1, 8, 9, 'Cheesy Galore', '76000.00', 11, NULL, 'uploads/1584600574647.png', '2020-03-19 13:49:34', '2020-03-23 02:54:36'),
(9, 8, 9, 'Double Cheese', '75000.00', 15, NULL, 'uploads/1584922995913.jpeg', '2020-03-23 07:23:15', NULL),
(10, 7, 8, 'Mocha Coffee', '35000.00', 20, NULL, 'uploads/1584923073279.jpeg', '2020-03-23 07:24:33', NULL),
(11, 6, 7, 'Chocolate Nut', '10000.00', 15, NULL, 'uploads/1584923122524.jpeg', '2020-03-23 07:25:22', NULL),
(12, 5, 6, 'Bucket Drummer Stick', '98000.00', 12, NULL, 'uploads/1584923182243.jpeg', '2020-03-23 07:26:22', '2020-03-23 10:04:50'),
(13, 9, 9, 'MEAT LOVERS CHEESY MAYO', '84000.00', 12, NULL, 'uploads/1584923285202.jpeg', '2020-03-23 07:28:05', NULL),
(14, 11, 7, 'Chocolate Super', '13000.00', 15, NULL, 'uploads/1584923329844.jpeg', '2020-03-23 07:28:49', NULL),
(15, 10, 8, 'Chocolate Hot', '37000.00', 15, NULL, 'uploads/1584923382760.jpeg', '2020-03-23 07:29:42', NULL),
(16, 12, 6, 'Bucket Extra Large', '110000.00', 10, NULL, 'uploads/1584923436393.jpeg', '2020-03-23 07:30:36', NULL),
(17, 11, 7, 'Chocolate Cheese', '13000.00', 21, NULL, 'uploads/1584923493678.jpeg', '2020-03-23 07:31:33', NULL),
(18, 9, 9, 'SUPER SUPREME', '74000.00', 13, NULL, 'uploads/1584923550861.jpeg', '2020-03-23 07:32:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `_id` int(11) UNSIGNED NOT NULL,
  `id_owner` int(11) UNSIGNED NOT NULL,
  `name` varchar(40) NOT NULL,
  `logo` text,
  `address` text,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `upated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`_id`, `id_owner`, `name`, `logo`, `address`, `description`, `created_at`, `upated_at`) VALUES
(5, 3, 'KFC Bogor', 'uploads/1584599736979.jpeg', 'Jl Sukasari III no.47, Bogor Timur, Kota Bogor', 'Buka Perdana, dan Tiada dua.', '2020-03-16 19:54:50', '2020-03-23 03:33:19'),
(6, 3, 'J.CO Bogor', 'uploads/1584363338060.jpeg', 'Jl Sukasari III no.47, Bogor Timur, Kota Bogor', 'Buka Perdana, dan Tiada dua.', '2020-03-16 19:55:38', '2020-03-23 03:33:20'),
(7, 3, 'Starbucks Bogor', 'uploads/1584363371558.jpeg', 'Jl Sukasari III no.47, Bogor Timur, Kota Bogor', 'Buka Perdana, dan Tiada dua.', '2020-03-16 19:56:11', '2020-03-23 03:33:20'),
(8, 3, 'Pizza Hut Bogor', 'uploads/1584363395548.jpeg', 'Jl Sukasari III no.47, Bogor Timur, Kota Bogor', 'Buka Perdana, dan Tiada dua.', '2020-03-16 19:56:35', '2020-03-23 03:33:20'),
(9, 5, 'Pizza Hut Bogor', 'uploads/1584363433048.jpeg', 'Jl Sukasari III no.47, Bogor Timur, Kota Bogor', 'Buka Perdana, dan Tiada dua.', '2020-03-16 19:57:13', '2020-03-23 03:33:20'),
(10, 5, 'Starbucks Bogor', 'uploads/1584363451207.jpeg', 'Jl Sukasari III no.47, Bogor Timur, Kota Bogor', 'Buka Perdana, dan Tiada dua.', '2020-03-16 19:57:31', '2020-03-23 03:33:20'),
(11, 5, 'J.CO Bogor', 'uploads/1584363470664.jpeg', 'Jl Sukasari III no.47, Bogor Timur, Kota Bogor', 'Buka Perdana, dan Tiada dua.', '2020-03-16 19:57:50', '2020-03-23 03:33:20'),
(12, 5, 'KFC Bogor', 'uploads/1584909250759.jpeg', 'Jl Sukasari III no.47, Bogor Timur, Kota Bogor', 'Buka Perdana, dan Tiada dua.', '2020-03-16 19:58:59', '2020-03-23 03:34:10'),
(13, 5, 'KFC 2', 'uploads/1584932944187.jpeg', 'Jl. Kramat 5 No.1 kel, RT.5/RW.9, Kenari, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10430', NULL, '2020-03-23 10:09:04', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `_id` int(11) UNSIGNED NOT NULL,
  `id_user` int(11) UNSIGNED NOT NULL,
  `list_item` text,
  `total_price` decimal(10,2) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`_id`, `id_user`, `list_item`, `total_price`, `created_at`) VALUES
(1, 6, '7', '76000.00', '2020-03-23 02:54:36'),
(2, 6, '8', '294000.00', '2020-03-23 10:04:50');

-- --------------------------------------------------------

--
-- Table structure for table `userprofile`
--

CREATE TABLE `userprofile` (
  `_id` int(11) UNSIGNED NOT NULL,
  `id_user` int(11) UNSIGNED NOT NULL,
  `fullname` varchar(70) DEFAULT NULL,
  `email` varchar(40) DEFAULT NULL,
  `code_verify` varchar(60) DEFAULT NULL,
  `balance` decimal(10,2) UNSIGNED DEFAULT '0.00',
  `gender` enum('male','female','other') DEFAULT NULL,
  `address` text,
  `picture` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userprofile`
--

INSERT INTO `userprofile` (`_id`, `id_user`, `fullname`, `email`, `code_verify`, `balance`, `gender`, `address`, `picture`, `created_at`, `updated_at`) VALUES
(3, 3, 'Treido Alde Ristivan', 'ristivantreido@gmail.com', NULL, '20011.00', 'male', 'Jl. Kramat 5 No.1 kel, RT.5/RW.9, Kenari, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10430', 'uploads/1584904544137.jpeg', '2020-03-15 19:11:18', '2020-03-23 02:15:44'),
(4, 4, 'Treido alde ristivan', 'ristivantreido@gmail.com', NULL, '0.00', 'male', 'Jl. Kramat 5 No.1 kel, RT.5/RW.9, Kenari, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10430', 'uploads/1584908417364.jpeg', '2020-03-15 21:31:10', '2020-03-23 03:20:17'),
(5, 5, NULL, 'ristivantreido@gmail.com', NULL, '9850000.00', NULL, NULL, NULL, '2020-03-16 10:38:33', '2020-03-22 21:46:27'),
(6, 6, 'Treido ', 'ristivantreido@gmail.com', NULL, '9478000.00', 'male', 'Jl. Kramat 5 No.1 kel, RT.5/RW.9, Kenari, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10430', 'uploads/1584932757361.png', '2020-03-16 15:09:44', '2020-03-23 10:05:57'),
(7, 7, NULL, 'ristivantreido@gmail.com', NULL, '0.00', NULL, NULL, NULL, '2020-03-21 15:08:13', '2020-03-21 15:09:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `_id` int(11) UNSIGNED NOT NULL,
  `username` varchar(40) NOT NULL,
  `password` varchar(100) NOT NULL,
  `status` tinyint(1) DEFAULT '0',
  `is_admin` tinyint(1) DEFAULT '0',
  `is_superadmin` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`_id`, `username`, `password`, `status`, `is_admin`, `is_superadmin`, `created_at`, `updated_at`) VALUES
(3, 'treido2', '$2a$10$zSO.XHDZ87VQQfADkgQE1Ow9V/h.DjmlhSqT6LwUwcGHe4H7otK3C', 1, 1, 0, '2020-03-15 19:11:18', '2020-03-22 22:50:41'),
(4, 'treido1', '$2a$10$JSbEYrDVZUD0vei6lvmJ4eohsuWorULBJVUTXhyQToGvdzE28gqFS', 1, 0, 1, '2020-03-15 21:31:10', '2020-03-15 21:40:03'),
(5, 'treido3', '$2a$10$kUFFegBai8xpZGzzmkiOauWeI8RI2b6pr.vWm/Ql/i37Pqn835j22', 1, 1, 0, '2020-03-16 10:38:33', '2020-03-16 15:57:39'),
(6, 'treido4', '$2a$10$jP.pdnyRRWwSt/9fr4hH4.uJbhNjeUPNAhYYD7oyTbeUuKOownN8C', 1, 0, 0, '2020-03-16 15:09:44', '2020-03-22 23:04:58'),
(7, 'treido5', '$2a$10$hWhHhzfpKpB8OVX8xk1sA.w1rN.8hKGf.XgMAcUeg/YgJVUDjexhO', 1, 0, 0, '2020-03-21 15:08:13', '2020-03-21 15:09:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `FK_User_Cart` (`id_user`);

--
-- Indexes for table `itemcategories`
--
ALTER TABLE `itemcategories`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `itemreviews`
--
ALTER TABLE `itemreviews`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `FK_User_Review` (`id_user`),
  ADD KEY `FK_Item_Review` (`id_item`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `FK_Restaurant` (`id_restaurant`),
  ADD KEY `FK_Category` (`id_category`);

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `FK_Owner` (`id_owner`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`_id`);

--
-- Indexes for table `userprofile`
--
ALTER TABLE `userprofile`
  ADD PRIMARY KEY (`_id`),
  ADD KEY `FK_User` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `itemcategories`
--
ALTER TABLE `itemcategories`
  MODIFY `_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `itemreviews`
--
ALTER TABLE `itemreviews`
  MODIFY `_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `userprofile`
--
ALTER TABLE `userprofile`
  MODIFY `_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `FK_User_Cart` FOREIGN KEY (`id_user`) REFERENCES `users` (`_id`) ON DELETE CASCADE;

--
-- Constraints for table `itemreviews`
--
ALTER TABLE `itemreviews`
  ADD CONSTRAINT `FK_Item_Review` FOREIGN KEY (`id_item`) REFERENCES `items` (`_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_User_Review` FOREIGN KEY (`id_user`) REFERENCES `users` (`_id`) ON DELETE SET NULL;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `FK_Category` FOREIGN KEY (`id_category`) REFERENCES `itemcategories` (`_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Restaurant` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurants` (`_id`) ON DELETE CASCADE;

--
-- Constraints for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `FK_Owner` FOREIGN KEY (`id_owner`) REFERENCES `users` (`_id`) ON DELETE CASCADE;

--
-- Constraints for table `userprofile`
--
ALTER TABLE `userprofile`
  ADD CONSTRAINT `FK_User` FOREIGN KEY (`id_user`) REFERENCES `users` (`_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
