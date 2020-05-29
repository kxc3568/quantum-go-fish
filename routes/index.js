const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/how-to-play', (req, res) => {
    res.render('how-to-play');
});

module.exports = router;
