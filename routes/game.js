const express = require('express');
const router = express.Router();

router.get('/:gameId', (req, res) => {
    res.render('game', { code: req.params.gameId });
});

module.exports = router;