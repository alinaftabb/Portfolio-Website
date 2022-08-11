const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users')

// @ROUTE   GET API/AUTH
// @DESC    TEST ROUTE
// @ACCESS  PUBLIC
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.err(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;