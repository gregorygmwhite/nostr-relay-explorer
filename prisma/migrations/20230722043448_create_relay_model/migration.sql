-- CreateTable
CREATE TABLE "Relay" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "metadata" JSONB,
    "registered_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Relay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Relay_url_key" ON "Relay"("url");
