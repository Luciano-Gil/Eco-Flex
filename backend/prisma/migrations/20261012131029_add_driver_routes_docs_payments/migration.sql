-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'HELD_ESCROW', 'RELEASED', 'REFUNDED');

-- AlterTable
ALTER TABLE "cargos" ADD COLUMN     "driverId" TEXT;

-- CreateTable
CREATE TABLE "driver_docs" (
    "id" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "licenseUrl" TEXT NOT NULL,
    "vtvUrl" TEXT NOT NULL,
    "insuranceUrl" TEXT NOT NULL,
    "status" "DocStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionNote" TEXT,
    "driverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver_routes" (
    "id" TEXT NOT NULL,
    "originCity" TEXT NOT NULL,
    "destCity" TEXT NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "availableM3" DOUBLE PRECISION NOT NULL,
    "availableKg" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "driverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driver_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "platformFee" DOUBLE PRECISION NOT NULL,
    "insuranceFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "driverAmount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "mpPreferenceId" TEXT,
    "mpPaymentId" TEXT,
    "cargoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "driver_docs_cuit_key" ON "driver_docs"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "driver_docs_driverId_key" ON "driver_docs"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_cargoId_key" ON "payments"("cargoId");

-- AddForeignKey
ALTER TABLE "cargos" ADD CONSTRAINT "cargos_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_docs" ADD CONSTRAINT "driver_docs_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver_routes" ADD CONSTRAINT "driver_routes_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "cargos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
