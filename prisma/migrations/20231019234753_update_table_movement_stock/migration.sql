/*
  Warnings:

  - You are about to drop the column `id_product` on the `movimentacao` table. All the data in the column will be lost.
  - Added the required column `id_estoque` to the `Movimentacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `movimentacao` DROP FOREIGN KEY `Movimentacao_id_product_fkey`;

-- AlterTable
ALTER TABLE `movimentacao` DROP COLUMN `id_product`,
    ADD COLUMN `id_estoque` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Movimentacao` ADD CONSTRAINT `Movimentacao_id_estoque_fkey` FOREIGN KEY (`id_estoque`) REFERENCES `Estoque`(`id_es`) ON DELETE RESTRICT ON UPDATE CASCADE;
