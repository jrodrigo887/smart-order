/*
  Warnings:

  - You are about to drop the column `email` on the `Waiter` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Waiter` table. All the data in the column will be lost.
  - Added the required column `restaurantId` to the `Waiter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Waiter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Waiter_email_key";

-- AlterTable
ALTER TABLE "Waiter" DROP COLUMN "email",
DROP COLUMN "phone",
ADD COLUMN     "restaurantId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT;
