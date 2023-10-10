/*
  Warnings:

  - Added the required column `id_stock` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produto` ADD COLUMN `id_stock` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_id_stock_fkey` FOREIGN KEY (`id_stock`) REFERENCES `Estoque`(`id_es`) ON DELETE RESTRICT ON UPDATE CASCADE;
