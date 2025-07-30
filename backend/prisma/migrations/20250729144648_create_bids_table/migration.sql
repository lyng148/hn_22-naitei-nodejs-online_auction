-- CreateTable
CREATE TABLE `bids` (
    `bid_id` CHAR(36) NOT NULL,
    `auction_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `bid_amount` DECIMAL(19, 4) NOT NULL,
    `status` ENUM('PENDING', 'VALID', 'INVALID') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`bid_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bids` ADD CONSTRAINT `bids_auction_id_fkey` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`auction_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bids` ADD CONSTRAINT `bids_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
