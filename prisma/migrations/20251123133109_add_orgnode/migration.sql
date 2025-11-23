-- CreateTable
CREATE TABLE "org_nodes" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_nodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "org_nodes" ADD CONSTRAINT "org_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "org_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
