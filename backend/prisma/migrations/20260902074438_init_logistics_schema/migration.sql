/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'DRIVER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('PARCEL', 'REMOVAL');

-- CreateEnum
CREATE TYPE "CargoStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_TRANSIT', 'DELIVERED', 'DISCREPANCY', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ItemSize" AS ENUM ('BOX_SMALL', 'BOX_MEDIUM', 'BOX_LARGE', 'FURNITURE_M', 'FURNITURE_L');

-- CreateEnum
CREATE TYPE "ItemWeight" AS ENUM ('LIGHT', 'MEDIUM', 'HEAVY', 'VERY_HEAVY');

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos" (
    "id" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL DEFAULT 'PARCEL',
    "status" "CargoStatus" NOT NULL DEFAULT 'PENDING',
    "originAddress" TEXT NOT NULL,
    "destAddress" TEXT NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "totalVolumeM3" DOUBLE PRECISION,
    "totalWeightKg" DOUBLE PRECISION,
    "finalPrice" DOUBLE PRECISION,
    "voiceRawText" TEXT,
    "extraNotes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "size" "ItemSize" NOT NULL DEFAULT 'BOX_MEDIUM',
    "weight" "ItemWeight" NOT NULL DEFAULT 'LIGHT',
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "cargoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargo_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargo_images" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "cargoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cargo_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "cargos" ADD CONSTRAINT "cargos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_items" ADD CONSTRAINT "cargo_items_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "cargos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargo_images" ADD CONSTRAINT "cargo_images_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "cargos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
