const express = require('express');
const multer = require('multer');
const router = express.Router();
const configureStorage = require('@/config/config.multer')


// Middleware for single file upload
const uploadSingleFile = (fieldName, folderName) => {
  const upload = configureStorage(folderName)
  
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          return res.status(400).json({
            status: false,
            message: `Multer error: ${err.message}`
          });
        }
        // An unknown error occurred
        return res.status(500).json({
          status: false,
          message: `Error uploading file: ${err.message}`
        });
      }
      
      // If no file was provided
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: 'No file uploaded'
        });
      }
      
      // Add file path to the request
      req.filePath = `/${req.file.path.replace(/\\/g, '/')}`;
      next();
    });
  };
};

// Middleware for multiple files upload
const uploadMultipleFiles = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({
            status: false,
            message: `Multer error: ${err.message}`
          });
        }
        return res.status(500).json({
          status: false,
          message: `Error uploading files: ${err.message}`
        });
      }
      
      // If no files were provided
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: false,
          message: 'No files uploaded'
        });
      }
      
      // Add file paths to the request
      req.filePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);
      next();
    });
  };
};

// Example route for single file upload
// router.post('/upload', uploadSingleFile('file'), (req, res) => {
//   res.status(200).json({
//     status: true,
//     message: 'File uploaded successfully',
//     filePath: req.filePath
//   });
// });

// Example route for multiple files upload
// router.post('/upload-multiple', uploadMultipleFiles('files', 5), (req, res) => {
//   res.status(200).json({
//     status: true,
//     message: 'Files uploaded successfully',
//     filePaths: req.filePaths
//   });
// });

module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  router
};