const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');

// Setup Multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return res.status(200).json({ data: sheetData });
  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
