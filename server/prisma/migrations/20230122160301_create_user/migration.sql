/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `days` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `habits` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "days_date_idx";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_oauth" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habits" ("created_at", "id", "title") SELECT "created_at", "id", "title" FROM "habits";
DROP TABLE "habits";
ALTER TABLE "new_habits" RENAME TO "habits";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "days_date_key" ON "days"("date");
