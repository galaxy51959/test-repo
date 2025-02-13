const multer = require('multer');
const s3 = require("../config/aws-config.js");
const { uploadFileToS3 } = require('../services/uploadToS3Service');
const moment = require('moment');
const url = "";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filename = String(moment(new Date()).format('HH:mm:ss  MM:DD:YYYY') + '...' + file.originalname);
      const url =  uploadFileToS3(file, process.env.AWS_S3_BUCKET_NAME, filename);
      // cb(null, 'public/tests');
    },
    filename: (req, file, cb) => {
    },
});
const upload = multer({ storage: storage });
const getStorage = async (req, res) => {
    try {
        const response = await s3.listObjectsV2({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            MaxKeys: 100,
            // Prefix: "folder/subfolder/", // Optional: Filter by prefix (folder)
          }).promise();
          return res.json(response.Contents) || [];
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStorage,
    uploadwithFiles: [upload.array('files')],
};
