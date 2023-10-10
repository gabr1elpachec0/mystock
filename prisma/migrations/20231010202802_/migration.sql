/*
  Warnings:

  - A unique constraint covering the columns `[nome_es]` on the table `Estoque` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Estoque_nome_es_key` ON `Estoque`(`nome_es`);
