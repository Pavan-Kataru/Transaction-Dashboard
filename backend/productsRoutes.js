const express = require('express');
const router = express.Router();
const productGet = require('./productGet');
const getStatistics = require('./getStatistics')


router.get('/', productGet.getProducts);

module.exports = router;