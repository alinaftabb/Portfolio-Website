const express = require('express');
const router = express.Router();
const config = require('config');
const request = require('request');
const Profile = require('../../models/Profile');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const Post = require('../../models/Posts');
const { check, validationResult } = require('express-validator');

// @ROUTE   GET API/PROFILE/ME
// @DESC    GET CURRENT USERS PROFILE
// @ACCESS  PRIVATE
router.get('/me', auth, async (req, res) => {
  try {
    console.log(req.user.id);
    const profile = await Profile.findOne({
      users: req.user.id,
    }).populate('users', ['name', 'gravatar']);
    console.log(profile);
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
    profileFields.users = req.user.id;
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

    console.log('IDL', profileFields);
    try {
      let profile = await Profile.findOne({ users: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { users: req.user.id },
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

// @ROUTE   GET API/PROFILE/USER/ID
// @DESC    GET PROFILES OF USERS BY ID
// @ACCESS  PUBLIC
router.get('/user/:user_id', async (req, res) => {
  try {
    const profiles = await Profile.findOne({
      users: req.params.user_id,
    }).populate('users', ['name', 'avatar']);

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
    await Post.deleteMany({ users: req.user.id });
    await Profile.findOneAndRemove({ users: req.user.id });
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
      check('from', 'From is required').not().isEmpty(),
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
      const profile = await Profile.findOne({ users: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @ROUTE   DELETE API/PROFILE/EXPERIENCE/:EXP_ID
// @DESC    DELETE EXPERIENCE
// @ACCESS  PRIVATE

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ users: req.user.id });
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @ROUTE   PUT API/PROFILE/EDUCATION
// @DESC    ADD EDUCATION
// @ACCESS  PRIVATE

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
    }
    const newEdu = ({
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body);

    try {
      const profile = await Profile.findOne({ users: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server error');
    }
  }
);

// @ROUTE   DELETE API/PROFILE/EDUCATION/:EDU_ID
// @DESC    DELETE EDUCATION
// @ACCESS  PRIVATE
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ users: req.user.id });
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @ROUTE   PUT API/PROFILE/GITHUB
// @DESC    ADD GITHUB REPOS
// @ACCESS  PRIVATE

router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});
module.exports = router;
