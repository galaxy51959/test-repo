const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createPrompt,
    getPrompts,
    getPromptById,
    getPromptsBySection,
    updatePrompt,
    deletePrompt,
} = require('../controllers/promptController');

// router.use(auth); // Apply authentication to all routes

router.post('/', createPrompt);
router.get('/', getPrompts);
router.get('/section', getPromptsBySection);
router.get('/:id', getPromptById);
router.patch('/:id', updatePrompt);
router.delete('/:id', deletePrompt);

module.exports = router;
