const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  users: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  text: { type: String, required: true },
  name: { type: String },
  avatar: { type: String },
  likes: [
    {
      users: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    },
  ],
  comments: [
    {
      users: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
      text: { type: String, required: true },
      name: { type: String },
      avatar: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = Posts = mongoose.model('posts', PostSchema);
