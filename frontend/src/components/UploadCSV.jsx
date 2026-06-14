import React, { useState } from 'react';
import { uploadExpensesCSV } from '../services/api';

function UploadCSV({ groupId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Capture the selected file from the local file system
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  // Process and transmit the selected CSV file to the backend server
  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a valid CSV file first.');
      return;
    }

    setIsUploading(true);
    setStatus('Uploading and processing file...');

    // Construct multipart form data for the API request payload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('groupId', groupId);

    try {
      const response = await uploadExpensesCSV(formData);
      if (response.data.success) {
        setStatus(`Success! Processed ${response.data.data.count} records.`);
        // Notify parent component to update the UI
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (error) {
      setStatus('Upload failed. Please verify the CSV format and try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f1f3f5', borderRadius: '6px', marginTop: '20px' }}>
      <h3>Import Expenses via CSV</h3>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          style={{ border: '1px solid #ced4da', padding: '5px', borderRadius: '4px', backgroundColor: 'white' }}
        />
        <button 
          onClick={handleUpload} 
          disabled={isUploading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: isUploading ? '#6c757d' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: isUploading ? 'not-allowed' : 'pointer' 
          }}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
      {/* Display dynamic feedback messages to the user */}
      {status && <p style={{ marginTop: '10px', fontSize: '14px', color: status.includes('failed') || status.includes('Please') ? '#dc3545' : '#28a745' }}>{status}</p>}
    </div>
  );
}

export default UploadCSV;