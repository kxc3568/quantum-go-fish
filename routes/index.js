const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/create', (req, res) => {
    res.render('create');
});

router.get('/join', (req, res) => {
    res.render('join');
});

module.exports = router;
