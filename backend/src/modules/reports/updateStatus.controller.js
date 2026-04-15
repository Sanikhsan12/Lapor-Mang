const prisma = require('../../core/db');
const io = require('../../core/socket');

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!['pending', 'under investigation', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Build update data — only include adminResponse if provided
    const updateData = { status };
    if (adminResponse !== undefined) {
      updateData.adminResponse = adminResponse;
    }

    const report = await prisma.report.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        user: { select: { username: true } }
      }
    });

    // Notify users about status update
    io.getIo().emit('status-update', report);

    res.status(200).json({ success: true, message: 'Status updated successfully', report });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateStatus };
