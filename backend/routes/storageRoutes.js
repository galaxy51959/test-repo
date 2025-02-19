const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getStorage,
    uploadwithFiles,
} = require('../controllers/storageController');

router.get('/', getStorage);
router.post('/upload', uploadwithFiles);

module.exports = router;
