-- AlterTable
ALTER TABLE `products` ADD COLUMN `auction_id` CHAR(36) NULL;

-- CreateTable
CREATE TABLE `auctions` (
    `auction_id` CHAR(36) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `start_time` TIMESTAMP(0) NOT NULL,
    `end_time` TIMESTAMP(0) NOT NULL,
    `current_price` DECIMAL(10, 2) NOT NULL,
    `starting_price` DECIMAL(10, 2) NOT NULL,
    `winner_id` CHAR(36) NULL,
    `status` ENUM('PENDING', 'READY', 'OPEN', 'CLOSED', 'CANCELED', 'COMPLETED', 'EXTENDED') NOT NULL DEFAULT 'PENDING',
    `minimum_bid_increment` DECIMAL(10, 2) NOT NULL,
    `last_bid_time` TIMESTAMP(0) NOT NULL,
    `bid_count` BIGINT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`auction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_auction_id_fkey` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`auction_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auctions` ADD CONSTRAINT `auctions_winner_id_fkey` FOREIGN KEY (`winner_id`) REFERENCES `users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
