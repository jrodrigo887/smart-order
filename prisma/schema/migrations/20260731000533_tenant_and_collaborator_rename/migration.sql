/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `CustomerCard` table. All the data in the column will be lost.
  - You are about to drop the column `waiterId` on the `CustomerCard` table. All the data in the column will be lost.
  - You are about to drop the column `waiterId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Waiter` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `collaboratorId` to the `CustomerCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishmentId` to the `CustomerCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collaboratorId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishmentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CollaboratorRole" AS ENUM ('WAITER', 'OWNER', 'KITCHEN_STAFF', 'CASHIER', 'CLEANING');

-- DropForeignKey
ALTER TABLE "CustomerCard" DROP CONSTRAINT "CustomerCard_waiterId_fkey";

-- AlterTable
ALTER TABLE "CustomerCard" DROP COLUMN "restaurantId",
DROP COLUMN "waiterId",
ADD COLUMN     "collaboratorId" TEXT NOT NULL,
ADD COLUMN     "establishmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "waiterId",
ADD COLUMN     "collaboratorId" TEXT NOT NULL,
ADD COLUMN     "establishmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropTable
DROP TABLE "Waiter";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,
    "userId" TEXT,
    "role" "CollaboratorRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collaborator_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Collaborator" ADD CONSTRAINT "Collaborator_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCard" ADD CONSTRAINT "CustomerCard_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCard" ADD CONSTRAINT "CustomerCard_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
