const prisma = require('../../core/db');
const io = require('../../core/socket');
const { uploadToBlob } = require('../../middlewares/uploadMiddleware');

const createReport = async (req, res, next) => {
  try {
    const { title, description, phone } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo is required' });
    }

    // Upload ke Azure Blob Storage → dapat URL publik permanen
    const photoUrl = await uploadToBlob(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

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

    // Emit socket event to notify admins in real-time
    io.getIo().emit('new-report', report);

    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReport };
