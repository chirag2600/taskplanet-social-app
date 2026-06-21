const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

const SORT_OPTIONS = {
  latest: { createdAt: -1 },
  mostLiked: { 'likes.length': -1, createdAt: -1 },
  mostCommented: { 'comments.length': -1, createdAt: -1 },
};

// GET /api/posts — public paginated feed
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 20 }).toInt(),
    query('sort').optional().isIn(['latest', 'mostLiked', 'mostCommented']),
    query('search').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid query parameters' });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const sortKey = req.query.sort || 'latest';
    const search = req.query.search || '';

    try {
      const filter = search
        ? { $or: [{ text: { $regex: search, $options: 'i' } }, { username: { $regex: search, $options: 'i' } }] }
        : {};

      let posts;
      let total;

      if (sortKey === 'mostLiked' || sortKey === 'mostCommented') {
        // Aggregation for accurate sort by array length
        const field = sortKey === 'mostLiked' ? 'likes' : 'comments';
        const pipeline = [
          ...(search
            ? [{ $match: filter }]
            : []),
          {
            $addFields: {
              _count: { $size: `$${field}` },
            },
          },
          { $sort: { _count: -1, createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $project: { _count: 0 } },
        ];
        const countPipeline = [
          ...(search ? [{ $match: filter }] : []),
          { $count: 'total' },
        ];

        [posts, total] = await Promise.all([
          Post.aggregate(pipeline),
          Post.aggregate(countPipeline),
        ]);
        total = total[0]?.total || 0;
      } else {
        [posts, total] = await Promise.all([
          Post.find(filter).sort(SORT_OPTIONS.latest).skip((page - 1) * limit).limit(limit).lean(),
          Post.countDocuments(filter),
        ]);
      }

      res.json({
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
          hasMore: page * limit < total,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
    }
  }
);

// POST /api/posts — create post (text and/or image)
router.post(
  '/',
  auth,
  [
    body('text').optional().trim().isLength({ max: 2000 }),
    body('imageUrl').optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const text = (req.body.text || '').trim();
    const imageUrl = req.body.imageUrl || '';

    if (!text && !imageUrl) {
      return res.status(400).json({ message: 'Post must contain text or an image' });
    }

    try {
      const post = await Post.create({
        username: req.user.username,
        profilePic: req.user.profilePic,
        text,
        imageUrl,
        likes: [],
        comments: [],
      });

      res.status(201).json({ post });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create post', error: err.message });
    }
  }
);

// POST /api/posts/:id/like — toggle like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const username = req.user.username;
    const index = post.likes.indexOf(username);

    if (index === -1) {
      post.likes.push(username);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.json({ post, liked: index === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update like', error: err.message });
  }
});

// POST /api/posts/:id/comments — add comment
router.post(
  '/:id/comments',
  auth,
  [body('text').trim().notEmpty().isLength({ max: 500 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Comment text is required (max 500 chars)' });
    }

    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      post.comments.push({
        username: req.user.username,
        text: req.body.text.trim(),
      });

      await post.save();
      res.status(201).json({ post });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add comment', error: err.message });
    }
  }
);

module.exports = router;
