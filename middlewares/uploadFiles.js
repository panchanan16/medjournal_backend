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
        req.filePath = "NO"
        next();
      } else {
        // Add file path to the request
        req.filePath = `/${req.file.path.replace(/\\/g, '/')}`;
        next();
      }

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


const uploadMultipleFields = (fields, folderName) => {
  const upload = configureStorage(folderName)

  return (req, res, next) => {
    // Validate fields parameter
    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        status: false,
        message: 'Fields configuration is required for file upload'
      });
    }

    // Use multer's fields method
    upload.fields(fields)(req, res, (err) => {
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

      // Initialize an object to store file paths by field
      req.filePaths = {};
      req.fileCategories = {};
      let totalFiles = 0;

      // Check if any files were uploaded
      if (!req.files) {
        return res.status(400).json({
          status: false,
          message: 'No files uploaded'
        });
      }

      // Process each field's files
      fields.forEach(field => {
        const fieldName = field.name;
        if (req.files[fieldName]) {
          // Add file paths for this field
          req.filePaths[fieldName] = req.files[fieldName].map(file =>
            `/${file.path.replace(/\\/g, '/')}`
          );

          // Add file categories for this field
          req.fileCategories[fieldName] = req.files[fieldName].map(file =>
            file.category || 'unknown'
          );

          totalFiles += req.files[fieldName].length;
        }
      });

      // If no files were actually uploaded across all fields
      if (totalFiles === 0) {
        return res.status(400).json({
          status: false,
          message: 'No files uploaded for any of the specified fields'
        });
      }

      // Add a flattened array of all file paths for convenience
      req.allFilePaths = Object.values(req.filePaths).flat();
      next();
    });
  };
};


module.exports = {
  uploadSingleFile,
  uploadMultipleFiles,
  uploadMultipleFields,
  router
};