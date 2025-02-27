-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "email" TEXT,
    "businessName" TEXT,
    "ownerName" TEXT,
    "address" TEXT,
    "UPIID" TEXT,
    "QR" TEXT,
    "logo" TEXT,
    "gstPercent" INTEGER NOT NULL DEFAULT 0,
    "templateNo" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_chatId_key" ON "User"("chatId");
