const express = require('express');
const router = express.Router();

// Example GET endpoint
router.get('/', (req, res) => {
    res.send('User route');
});

module.exports = router;