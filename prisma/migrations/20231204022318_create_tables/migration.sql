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
    `id_categoria` INTEGER NOT NULL,
    `nome_es` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_es`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id_prod` INTEGER NOT NULL AUTO_INCREMENT,
    `id_stock` INTEGER NOT NULL,
    `nome_prod` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 0,
    `valor` DOUBLE NOT NULL,
    `custo` DOUBLE NOT NULL,
    `imagem` VARCHAR(191) NOT NULL,
    `id_supply` INTEGER NOT NULL,

    PRIMARY KEY (`id_prod`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `Fornecedor` (
    `id_forn` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_forn` VARCHAR(191) NOT NULL,
    `email_forn` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Fornecedor_email_forn_key`(`email_forn`),
    PRIMARY KEY (`id_forn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Categoria_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Estoque` ADD CONSTRAINT `Estoque_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Usuario`(`id_us`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Estoque` ADD CONSTRAINT `Estoque_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_id_stock_fkey` FOREIGN KEY (`id_stock`) REFERENCES `Estoque`(`id_es`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_id_supply_fkey` FOREIGN KEY (`id_supply`) REFERENCES `Fornecedor`(`id_forn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao_Estoque` ADD CONSTRAINT `Movimentacao_Estoque_id_estoque_fkey` FOREIGN KEY (`id_estoque`) REFERENCES `Estoque`(`id_es`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao_Produto` ADD CONSTRAINT `Movimentacao_Produto_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `Produto`(`id_prod`) ON DELETE RESTRICT ON UPDATE CASCADE;
