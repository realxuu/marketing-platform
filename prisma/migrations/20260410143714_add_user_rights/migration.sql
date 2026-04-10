-- CreateTable
CREATE TABLE "UserRight" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rightId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "totalCount" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expireAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RightUsage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userRightId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "operator" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RightUsage_userRightId_fkey" FOREIGN KEY ("userRightId") REFERENCES "UserRight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "UserRight_userId_idx" ON "UserRight"("userId");

-- CreateIndex
CREATE INDEX "UserRight_status_idx" ON "UserRight"("status");

-- CreateIndex
CREATE INDEX "RightUsage_userRightId_idx" ON "RightUsage"("userRightId");
