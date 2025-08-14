-- AlterTable
ALTER TABLE `chat_rooms` ADD COLUMN `deleted_by_user1` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `deleted_by_user2` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `user1_deleted_at` TIMESTAMP(0) NULL,
    ADD COLUMN `user2_deleted_at` TIMESTAMP(0) NULL;
