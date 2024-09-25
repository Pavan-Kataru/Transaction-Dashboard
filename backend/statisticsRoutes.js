const express = require('express');
const router = express.Router();
const { getStatisticsByMonth } = require('./getStatistics'); // Destructure the correct function

// Route to get statistics for a selected month
router.get('/', getStatisticsByMonth); // Use the correct function reference

module.exports = router;
