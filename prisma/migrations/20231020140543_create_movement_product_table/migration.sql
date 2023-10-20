/*
  Warnings:

  - You are about to drop the `movimentacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `movimentacao` DROP FOREIGN KEY `Movimentacao_id_estoque_fkey`;

-- DropForeignKey
ALTER TABLE `movimentacao` DROP FOREIGN KEY `Movimentacao_id_produto_fkey`;

-- DropTable
DROP TABLE `movimentacao`;

-- CreateTable
CREATE TABLE `Movimentacao_Estoque` (
    `id_mov` INTEGER NOT NULL AUTO_INCREMENT,
    `id_estoque` INTEGER NOT NULL,
    `operacao` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_mov`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movimentacao_Produto` (
    `id_mov` INTEGER NOT NULL AUTO_INCREMENT,
    `id_produto` INTEGER NOT NULL,
    `operacao` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_mov`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Movimentacao_Estoque` ADD CONSTRAINT `Movimentacao_Estoque_id_estoque_fkey` FOREIGN KEY (`id_estoque`) REFERENCES `Estoque`(`id_es`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao_Produto` ADD CONSTRAINT `Movimentacao_Produto_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `Produto`(`id_prod`) ON DELETE RESTRICT ON UPDATE CASCADE;
