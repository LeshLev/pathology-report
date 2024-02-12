-- CreateTable
CREATE TABLE "Condition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DiagnosticGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DiagnosticMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "oru_sonic_codes" TEXT NOT NULL DEFAULT '',
    "oru_sonic_units" TEXT NOT NULL DEFAULT '',
    "units" TEXT NOT NULL DEFAULT '',
    "min_age" INTEGER,
    "max_age" INTEGER,
    "gender" TEXT NOT NULL,
    "standard_lower" REAL,
    "standard_higher" REAL,
    "everlab_lower" REAL,
    "everlab_higher" REAL,
    "conditionId" INTEGER,
    "diagnosticId" INTEGER,
    CONSTRAINT "DiagnosticMetric_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticMetric_diagnosticId_fkey" FOREIGN KEY ("diagnosticId") REFERENCES "Diagnostic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Diagnostic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DiagnosticGroupToDiagnosticMetric" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DiagnosticGroupToDiagnosticMetric_A_fkey" FOREIGN KEY ("A") REFERENCES "DiagnosticGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DiagnosticGroupToDiagnosticMetric_B_fkey" FOREIGN KEY ("B") REFERENCES "DiagnosticMetric" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DiagnosticToDiagnosticGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DiagnosticToDiagnosticGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Diagnostic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DiagnosticToDiagnosticGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "DiagnosticGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Condition_name_key" ON "Condition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticGroup_name_key" ON "DiagnosticGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticMetric_name_key" ON "DiagnosticMetric"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnostic_name_key" ON "Diagnostic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DiagnosticGroupToDiagnosticMetric_AB_unique" ON "_DiagnosticGroupToDiagnosticMetric"("A", "B");

-- CreateIndex
CREATE INDEX "_DiagnosticGroupToDiagnosticMetric_B_index" ON "_DiagnosticGroupToDiagnosticMetric"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DiagnosticToDiagnosticGroup_AB_unique" ON "_DiagnosticToDiagnosticGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_DiagnosticToDiagnosticGroup_B_index" ON "_DiagnosticToDiagnosticGroup"("B");
