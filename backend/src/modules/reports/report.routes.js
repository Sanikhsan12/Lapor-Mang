const express = require('express');
const upload = require('../../middlewares/uploadMiddleware');
const { verifyToken, verifyAdmin } = require('../../middlewares/authMiddleware');
const { createReport } = require('./createReport.controller');
const { getReports } = require('./getReports.controller');
const { updateStatus } = require('./updateStatus.controller');

const router = express.Router();

router.post('/', verifyToken, upload.single('photo'), createReport);
router.get('/', verifyToken, getReports);
router.put('/:id/status', verifyToken, verifyAdmin, updateStatus);

module.exports = router;
