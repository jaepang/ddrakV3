-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "isSuper" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "startRecur" TIMESTAMP(3) NOT NULL,
    "endRecur" TIMESTAMP(3) NOT NULL,
    "daysOfWeek" JSONB NOT NULL,
    "groupId" TEXT NOT NULL,
    "allDay" BOOLEAN NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3e80bd',
    "desc" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
