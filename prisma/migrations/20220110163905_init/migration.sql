-- CreateTable
CREATE TABLE "Rank" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "traits" TEXT NOT NULL,
    "projId" TEXT NOT NULL
);
