const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');

// @ROUTE   GET API/PROFILE
// @DESC    TEST ROUTE
// @ACCESS  PUBLIC
router.get('/me',auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'gravatar']);

        if (!profile) return res.status(400).send('There is no profile for this user');
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }

});

module.exports = router;