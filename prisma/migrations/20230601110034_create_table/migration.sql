-- CreateTable
CREATE TABLE `Usuario` (
    `id_us` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nome_us` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id_us`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estoque` (
    `id_es` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `nome_es` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_es`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id_prod` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_prod` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `id_supply` INTEGER NOT NULL,

    PRIMARY KEY (`id_prod`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movimentacao` (
    `id_mov` INTEGER NOT NULL AUTO_INCREMENT,
    `id_product` INTEGER NOT NULL,
    `operacao` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_mov`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fornecedor` (
    `id_forn` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_forn` VARCHAR(191) NOT NULL,
    `email_forn` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_forn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fin_estoque` (
    `id_fin_es` INTEGER NOT NULL AUTO_INCREMENT,
    `id_stock` INTEGER NOT NULL,
    `Valor` DOUBLE NOT NULL,
    `Invest` DOUBLE NOT NULL,
    `Bruto` DOUBLE NOT NULL,
    `Liquido` DOUBLE NOT NULL,

    PRIMARY KEY (`id_fin_es`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fin_produto` (
    `id_fin_prod` INTEGER NOT NULL AUTO_INCREMENT,
    `id_product` INTEGER NOT NULL,
    `Valor` DOUBLE NOT NULL,
    `Invest` DOUBLE NOT NULL,
    `Bruto` DOUBLE NOT NULL,
    `Liquido` DOUBLE NOT NULL,

    PRIMARY KEY (`id_fin_prod`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Estoque` ADD CONSTRAINT `Estoque_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Usuario`(`id_us`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_id_supply_fkey` FOREIGN KEY (`id_supply`) REFERENCES `Fornecedor`(`id_forn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao` ADD CONSTRAINT `Movimentacao_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Produto`(`id_prod`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fin_estoque` ADD CONSTRAINT `Fin_estoque_id_stock_fkey` FOREIGN KEY (`id_stock`) REFERENCES `Estoque`(`id_es`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fin_produto` ADD CONSTRAINT `Fin_produto_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Produto`(`id_prod`) ON DELETE RESTRICT ON UPDATE CASCADE;
