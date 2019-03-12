const express = require('express');
const router = express.Router();

/**
 * @route GET api/budget/test
 * @desc Tests budget route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'Budget works!' }));

module.exports = router;
