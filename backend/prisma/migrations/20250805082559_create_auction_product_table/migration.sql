/*
  Warnings:

  - You are about to drop the column `auction_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_auction_id_fkey`;

-- DropIndex
DROP INDEX `products_auction_id_fkey` ON `products`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `auction_id`;

-- CreateTable
CREATE TABLE `auction_products` (
    `auction_product_id` CHAR(36) NOT NULL,
    `auction_id` CHAR(36) NOT NULL,
    `product_id` CHAR(36) NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `auction_products_auction_id_product_id_key`(`auction_id`, `product_id`),
    PRIMARY KEY (`auction_product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `auction_products` ADD CONSTRAINT `auction_products_auction_id_fkey` FOREIGN KEY (`auction_id`) REFERENCES `auctions`(`auction_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auction_products` ADD CONSTRAINT `auction_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
