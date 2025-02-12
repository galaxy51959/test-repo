const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getStorage
} = require('../controllers/storageController');


router.get('/storage', getStorage);


module.exports = router;
