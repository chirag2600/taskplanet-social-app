const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    profilePic: { type: String, default: '' },
    text: { type: String, default: '', trim: true, maxlength: 2000 },
    imageUrl: { type: String, default: '' },
    likes: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// At least text or image must be present — validated in route handler
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
