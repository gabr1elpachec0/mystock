/*
  Warnings:

  - You are about to drop the `fin_estoque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fin_produto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_categoria` to the `Estoque` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `fin_estoque` DROP FOREIGN KEY `Fin_estoque_id_stock_fkey`;

-- DropForeignKey
ALTER TABLE `fin_produto` DROP FOREIGN KEY `Fin_produto_id_product_fkey`;

-- AlterTable
ALTER TABLE `estoque` ADD COLUMN `id_categoria` INTEGER NOT NULL;

-- DropTable
DROP TABLE `fin_estoque`;

-- DropTable
DROP TABLE `fin_produto`;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Categoria_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Estoque` ADD CONSTRAINT `Estoque_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
