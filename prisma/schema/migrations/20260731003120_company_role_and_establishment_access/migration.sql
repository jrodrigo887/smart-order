-- CreateEnum
CREATE TYPE "CompanyRoleType" AS ENUM ('ADMINISTRATOR', 'MEMBER');

-- CreateTable
CREATE TABLE "CompanyRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" "CompanyRoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstablishmentAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EstablishmentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyRole_userId_companyId_key" ON "CompanyRole"("userId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "EstablishmentAccess_userId_establishmentId_key" ON "EstablishmentAccess"("userId", "establishmentId");

-- AddForeignKey
ALTER TABLE "CompanyRole" ADD CONSTRAINT "CompanyRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyRole" ADD CONSTRAINT "CompanyRole_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentAccess" ADD CONSTRAINT "EstablishmentAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentAccess" ADD CONSTRAINT "EstablishmentAccess_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
