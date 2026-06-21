require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://chiragtekani39_db_user:olKkNobc95N9WVDT@cluster0.3khh9lt.mongodb.net/taskplanet-social?retryWrites=true&w=majority';

const SAMPLE_USERS = [
  { username: 'kingz3rl', email: 'bibek@taskplanet.demo', password: 'demo123456' },
  { username: 'alice_dev', email: 'alice@taskplanet.demo', password: 'demo123456' },
  { username: 'chirag2600', email: 'chirag@taskplanet.demo', password: 'demo123456' },
  { username: 'taskmaster', email: 'tasks@taskplanet.demo', password: 'demo123456' },
];

const SAMPLE_POSTS = [
  {
    username: 'kingz3rl',
    text: '🏆 LEADERBOARD ACHIEVEMENT 🏆\n\nJust reached the top of the leaderboard! Hard work pays off 💪\n\n#TaskPlanet #Leaderboard #Achievement',
    imageUrl: 'https://images.unsplash.com/photo-1513151236698-03950f89f46b?w=800&q=80',
    likes: ['alice_dev', 'chirag2600', 'taskmaster'],
    comments: [
      { username: 'alice_dev', text: 'Congratulations! Well deserved 🎉' },
      { username: 'chirag2600', text: 'Amazing work! Keep it up 🔥' },
    ],
    hoursAgo: 2,
  },
  {
    username: 'alice_dev',
    text: 'Completed 50 tasks this week on #TaskPlanet! The grind never stops 🚀\n\nWho else is chasing the gold badge?',
    imageUrl: '',
    likes: ['kingz3rl', 'taskmaster'],
    comments: [{ username: 'taskmaster', text: 'Same here! 45 tasks and counting 💯' }],
    hoursAgo: 5,
  },
  {
    username: 'chirag2600',
    text: 'Just built this social feed app for the 3W internship assignment! 🎉\n\nReact + Node + MongoDB stack. Check it out!\n\n#TaskPlanet #FullStack #ReactJS',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    likes: ['alice_dev', 'kingz3rl'],
    comments: [],
    hoursAgo: 8,
  },
  {
    username: 'taskmaster',
    text: 'Daily reminder: Complete your tasks, earn gold coins, and climb the leaderboard! ⭐\n\n#TaskPlanet #DailyMotivation',
    imageUrl: '',
    likes: ['kingz3rl', 'alice_dev', 'chirag2600'],
    comments: [
      { username: 'kingz3rl', text: 'Thanks for the motivation!' },
      { username: 'alice_dev', text: 'On it! 💪' },
    ],
    hoursAgo: 12,
  },
  {
    username: 'kingz3rl',
    text: 'Weekend vibes 🌟 Earned 200 gold coins today from completing promotions!\n\n#TaskPlanet #GoldCoins #Weekend',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    likes: ['chirag2600'],
    comments: [{ username: 'chirag2600', text: 'How do you earn so fast? Teach me! 😄' }],
    hoursAgo: 24,
  },
  {
    username: 'alice_dev',
    text: 'New to TaskPlanet and loving the community! Everyone here is so supportive 🤝\n\n#TaskPlanet #NewUser',
    imageUrl: '',
    likes: ['taskmaster', 'kingz3rl'],
    comments: [],
    hoursAgo: 36,
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Upsert users
  for (const u of SAMPLE_USERS) {
    const exists = await User.findOne({ username: u.username });
    if (!exists) {
      await User.create(u);
      console.log(`Created user: ${u.username}`);
    } else {
      console.log(`User exists: ${u.username}`);
    }
  }

  const existingPosts = await Post.countDocuments();
  if (existingPosts >= 3) {
    console.log(`Database already has ${existingPosts} posts — skipping post seed.`);
    console.log('Run with FORCE_SEED=1 to re-seed posts.');
    if (process.env.FORCE_SEED !== '1') {
      await mongoose.disconnect();
      return;
    }
    await Post.deleteMany({});
    console.log('Cleared existing posts (FORCE_SEED=1)');
  }

  for (const p of SAMPLE_POSTS) {
    const createdAt = new Date(Date.now() - p.hoursAgo * 60 * 60 * 1000);
    await Post.create({
      username: p.username,
      profilePic: '',
      text: p.text,
      imageUrl: p.imageUrl,
      likes: p.likes,
      comments: p.comments.map((c) => ({ ...c, createdAt })),
      createdAt,
      updatedAt: createdAt,
    });
    console.log(`Created post by @${p.username}`);
  }

  const total = await Post.countDocuments();
  console.log(`\nDone! ${total} posts in database.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
