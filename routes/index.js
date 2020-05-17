const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/create', function(req, res, next) {
    res.render('create');
});

router.get('/join', function(req, res, next) {
    res.render('join');
});

module.exports = router;
