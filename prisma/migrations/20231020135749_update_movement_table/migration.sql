/*
  Warnings:

  - Added the required column `id_produto` to the `Movimentacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `movimentacao` ADD COLUMN `id_produto` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Movimentacao` ADD CONSTRAINT `Movimentacao_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `Produto`(`id_prod`) ON DELETE RESTRICT ON UPDATE CASCADE;
