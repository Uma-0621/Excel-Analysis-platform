const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');

// Multer storage setup with memory storage
const storage = multer.memoryStorage();

// Add a file size limit (e.g., 10MB)
const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 }  // 10MB max file size
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileType = req.file.mimetype;
    if (fileType !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return res.status(400).json({ error: 'Invalid file type. Please upload an Excel file.' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return res.status(200).json({ data: sheetData });
  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ error: 'Something went wrong while uploading the file.' });
  }
});

module.exports = router;
