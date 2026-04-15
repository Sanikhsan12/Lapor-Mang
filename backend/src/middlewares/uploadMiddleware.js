const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');

// ── Azure Blob Storage setup ──────────────────────────────────────────────────
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'laporan-photos';

/**
 * Upload a file buffer to Azure Blob Storage.
 * @param {Buffer} buffer - File buffer dari multer memoryStorage
 * @param {string} originalname - Nama asli file
 * @param {string} mimetype - MIME type file
 * @returns {Promise<string>} URL publik blob
 */
const uploadToBlob = async (buffer, originalname, mimetype) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Buat container jika belum ada (idempotent)
  await containerClient.createIfNotExists({ access: 'blob' });

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const ext = path.extname(originalname);
  const blobName = `photo-${uniqueSuffix}${ext}`;

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: mimetype },
  });

  return blockBlobClient.url; // URL publik yang bisa langsung disimpan ke DB
};

// ── Multer: simpan di memori, bukan disk ─────────────────────────────────────
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

module.exports = upload;
module.exports.uploadToBlob = uploadToBlob;
