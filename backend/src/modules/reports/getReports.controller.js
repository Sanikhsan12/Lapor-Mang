const prisma = require('../../core/db');

// Get reports (User gets their own, Admin gets all with filters)
const getReports = async (req, res, next) => {
  try {
    const { role } = req.userRole ? req : { userRole: 'user' }; 
    const isUserAdmin = req.userRole === 'admin';

    // Filters for Admin
    const { date, month, year } = req.query; // example: date=2024-05-20, month=05, year=2024

    let whereClause = {};
    if (!isUserAdmin) {
      whereClause.userId = req.userId;
    } else {
      // Build date filters if provided
      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        whereClause.createdAt = {
          gte: startDate,
          lt: endDate,
        };
      } else if (month && year) {
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        whereClause.createdAt = {
          gte: startDate,
          lt: endDate,
        };
      } else if (year) {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${parseInt(year) + 1}-01-01`);
        whereClause.createdAt = {
          gte: startDate,
          lt: endDate,
        };
      }
    }

    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        user: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReports };
