const path = require('path');
const fs = require('fs');
const multer = require('multer');

function configureStorage(folder) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = `uploads/${folder}`;

            // Create uploads directory if it doesn't exist
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            // Create unique filename with original extension
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, file.fieldname + '-' + uniqueSuffix + ext);
        }
    });


    const upload = multer({ 
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB file size limit
      }
    });

    return upload;
}


module.exports = configureStorage;