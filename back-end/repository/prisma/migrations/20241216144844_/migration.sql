/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Cocktail` table. All the data in the column will be lost.
  - Added the required column `image` to the `Cocktail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cocktail" DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT NOT NULL;
