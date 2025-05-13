import React, { useState } from 'react';
import axios from 'axios';
import { FaFileExcel, FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import DataViewer from './DataViewer';

const UploadForm = () => {
  const [excelData, setExcelData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select an Excel file!' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });

      const response = await axios.post('http://localhost:5000/api/file/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.data.length > 0) {
        setExcelData(response.data.data);
        setMessage({ type: 'success', text: '✅ File uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Excel file uploaded, but no data found!' });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({ type: 'error', text: 'Something went wrong while uploading the file.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
        <h2 className="text-3xl font-extrabold mb-6 flex items-center justify-center text-blue-700">
          <FaFileExcel className="mr-2" /> Upload Excel File
        </h2>

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-800 file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0 file:font-semibold
              file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
            />
            {file && (
              <p className="text-sm mt-2 text-gray-600 text-center">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-white transition font-semibold shadow-md ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <FaUpload />
              {loading ? 'Uploading...' : 'Upload & Preview'}
            </button>
          </div>

          {message.text && (
            <div
              className={`flex items-center justify-center gap-2 mt-2 p-3 rounded-md text-sm text-center ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
              <span>{message.text}</span>
            </div>
          )}
        </form>

        {excelData && (
          <div className="mt-10">
            <DataViewer data={excelData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
