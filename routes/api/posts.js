const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const Profile = require('../../models/Profile');
const Post = require('../../models/Posts');
const Posts = require('../../models/Posts');

// @ROUTE   POST API/POSTS
// @DESC    CREATE A POST
// @ACCESS  PRIVATE
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ error: errors.array() });

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Posts({
        users: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);

      return res.status(500).send('Server error');
    }
  }
);

// @ROUTE   GET API/POSTS
// @DESC    GET ALL POSTS
// @ACCESS  PRIVATE
router.get('/', auth, async (req, res) => {
  try {
    const post = await Posts.find().sort({ date: -1 });
    res.json(post);
  } catch (err) {
    console.error(err.message);

    return res.status(500).send('Server error');
  }
});

// @ROUTE   GET API/POSTS/:POST_ID
// @DESC    GET POSTS OF USER BY ID
// @ACCESS  PRIVATE
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind == 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });

    return res.status(500).send('Server error');
  }
});

// @ROUTE   DELETE API/POSTS/:POST_ID
// @DESC    DELETE POSTS OF USER BY ID
// @ACCESS  PRIVATE
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.users.toString() !== req.user.id)
      return res.status(401).json({ msg: 'User not authorized' });

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);

    if (err.kind == 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });

    return res.status(500).send('Server error');
  }
});

// @ROUTE   PUT API/POSTS/LIKE/:POST_ID
// @DESC    LIKE A POST
// @ACCESS  PRIVATE

router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);
    if (
      post.likes.filter(like => like.users.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ users: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

// @ROUTE   PUT API/POSTS/UNLIKE/:POST_ID
// @DESC    UNLIKE A POST
// @ACCESS  PRIVATE

router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.post_id);
    if (
      post.likes.filter(like => like.users.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    const removeIndex = post.likes
      .map(like => like.users.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});

module.exports = router;
