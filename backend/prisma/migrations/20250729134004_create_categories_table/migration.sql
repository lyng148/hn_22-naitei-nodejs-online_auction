-- CreateTable
CREATE TABLE `categories` (
    `category_id` CHAR(36) NOT NULL,
    `name` ENUM('ELECTRONICS', 'FASHION', 'COLLECTIBLES', 'HOME_APPLIANCES', 'SPORTS_EQUIPMENT', 'TOYS_AND_GAMES', 'VEHICLES', 'REAL_ESTATE', 'ART_AND_CRAFTS', 'JEWELRY_AND_ACCESSORIES', 'HEALTH_AND_BEAUTY', 'GARDEN_AND_OUTDOORS', 'MUSIC_INSTRUMENTS', 'PET_SUPPLIES', 'OFFICE_SUPPLIES') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products_categories` (
    `product_id` CHAR(36) NOT NULL,
    `category_id` CHAR(36) NOT NULL,

    PRIMARY KEY (`product_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products_categories` ADD CONSTRAINT `products_categories_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_categories` ADD CONSTRAINT `products_categories_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;
