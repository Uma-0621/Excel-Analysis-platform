const mongoose = require('mongoose');

const ExcelDataSchema = new mongoose.Schema({
  filename: String,
  data: Array,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExcelData', ExcelDataSchema);
