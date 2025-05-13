// src/FileUpload.js
import React, { useState } from "react";
import * as XLSX from "xlsx";

function FileUpload({ onDataParsed }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];  // Assuming you're using the first sheet
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        onDataParsed(parsedData);  // Send data to parent component
      };
      reader.readAsBinaryString(uploadedFile);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {file && <p>{file.name}</p>}
    </div>
  );
}

export default FileUpload;
