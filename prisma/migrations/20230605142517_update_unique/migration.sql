/*
  Warnings:

  - A unique constraint covering the columns `[email_forn]` on the table `Fornecedor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Fornecedor_email_forn_key` ON `Fornecedor`(`email_forn`);
