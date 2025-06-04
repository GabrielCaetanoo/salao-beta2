-- CreateTable
CREATE TABLE "Bloqueio" (
    "id" SERIAL NOT NULL,
    "horario" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,

    CONSTRAINT "Bloqueio_pkey" PRIMARY KEY ("id")
);
