const prisma = require('../../core/db');
const io = require('../../core/socket');

const createReport = async (req, res, next) => {
  try {
    const { title, description, phone } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo is required' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    const report = await prisma.report.create({
      data: {
        title,
        description,
        photoUrl,
        phone: phone || null,
        userId: req.userId
      },
      include: {
        user: { select: { username: true } }
      }
    });

    // Emmit socket event to notify admins in real-time
    io.getIo().emit('new-report', report);

    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReport };
