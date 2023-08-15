var express = require('express');
const { getAllJobs,setFilterObject } = require('../services/jobService');

var router = express.Router();


/* GET home page. */
router.get('/',setFilterObject, getAllJobs);

module.exports = router;
