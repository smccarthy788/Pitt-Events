var express = require('express');
var router = express.Router();
var Location = require('../models/location.js');
var Event = require('../models/event.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{
        title: 'Pitt Events'
    });
});

module.exports = router;
