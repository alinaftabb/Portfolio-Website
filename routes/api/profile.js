const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');

// @ROUTE   GET API/PROFILE/ME
// @DESC    GET CURRENT USERS PROFILE
// @ACCESS  PRIVATE
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('users', ['name', 'gravatar']);

    if (!profile)
      return res.status(400).send('There is no profile for this user');

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @ROUTE   GET API/PROFILE
// @DESC    CREATE OR UPDATE A USER PROFILE
// @ACCESS  PRIVATE
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.company = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @ROUTE   GET API/PROFILE/USER
// @DESC    GET PROFILES OF ALL USERS
// @ACCESS  PUBLIC
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('users', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @ROUTE   GET API/PROFILE/USER
// @DESC    GET PROFILES OF ALL USERS
// @ACCESS  PUBLIC
router.get('/user/:user_id', async (req, res) => {
  try {
    const profiles = await Profile.findOne().populate('users', [
      'name',
      'avatar',
    ]);

    if (!profiles)
      return res.status(400).send('There is no profile for this user');

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @ROUTE   DELETE API/PROFILE
// @DESC    DELETE PROFILE, USERS & POSTS
// @ACCESS  PRIVATE

router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @ROUTE   PUT API/PROFILE/EXPERIENCE
// @DESC    ADD EXPERIENCE
// @ACCESS  PRIVATE

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
    }
    const newExp = ({
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body);

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

module.exports = router;
