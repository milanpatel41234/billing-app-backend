const multer = require("multer");
const fs = require("fs");

const uploadDir = 'images/company';

// Create the directory if it doesn't exist
fs.mkdirSync(uploadDir, { recursive: true }, (err) => {
    if (err) {
        console.error('Error creating directory:', err);
    } else {
        console.log('Directory is created');
    }
});

 
const storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
      cb(null, './images/company') 
    }, 
    filename: function (req, file, cb) { 
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) 
    cb(null, uniqueSuffix + file.originalname) 
    } 
  }) 
 
const upload = multer({ storage })

module.exports = upload;
