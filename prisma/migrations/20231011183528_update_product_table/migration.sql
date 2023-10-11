/*
  Warnings:

  - Added the required column `imagem` to the `Produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `produto` ADD COLUMN `imagem` VARCHAR(191) NOT NULL,
    ADD COLUMN `quantidade` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `valor` DOUBLE NOT NULL;
