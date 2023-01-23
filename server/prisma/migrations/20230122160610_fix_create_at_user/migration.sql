-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "id_oauth" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("created_at", "id", "id_oauth") SELECT "created_at", "id", "id_oauth" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
