const { PrismaClient } = require('../src/generated/prisma');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    await prisma.$connect();
    const deleteQuarterlyReports = prisma.quarterlyReport.deleteMany();
    const deleteLiveReports = prisma.liveReport.deleteMany();
    const deleteAttendances = prisma.attendance.deleteMany();
    const deleteActivities = prisma.activity.deleteMany();
    const deleteAnnouncements = prisma.announcement.deleteMany();
    const deleteMessages = prisma.message.deleteMany();
    const deleteStudents = prisma.student.deleteMany();
    const deleteClassrooms = prisma.classroom.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([
      deleteQuarterlyReports,
      deleteLiveReports,
      deleteAttendances,
      deleteActivities,
      deleteAnnouncements,
      deleteMessages,
      deleteStudents,
      deleteClassrooms,
      deleteUsers,
    ]);

    await prisma.$disconnect();
    execSync('npm run prisma:seed', { stdio: 'inherit' });

  } catch (error) {
    console.error('Error resetting database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

resetDatabase();