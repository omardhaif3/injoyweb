import express from 'express';
import Post from '../models/post.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { question, options } = req.body;
    
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        error: 'Question and at least 2 options are required' 
      });
    }
    
    // Create post with options
    const post = new Post({
      question,
      options: options.map(optionText => ({ text: optionText })),
    });
    
    const savedPost = await post.save();
    
    // Emit new post event
    const io = req.app.get('io');
    if (io) {
      io.emit('newPost', savedPost);
    }
    
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote on a post
router.post('/:id/vote', async (req, res) => {
  try {
    const { optionId } = req.body;
    
    if (!optionId) {
      return res.status(400).json({ error: 'Option ID is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Find and increment the vote count for the selected option
    const option = post.options.id(optionId);
    
    if (!option) {
      return res.status(404).json({ error: 'Option not found' });
    }
    
    option.votes += 1;
    post.totalVotes = post.options.reduce((sum, opt) => sum + opt.votes, 0);
    
    const updatedPost = await post.save();
    
    // Emit vote event
    const io = req.app.get('io');
    if (io) {
      io.emit('vote', updatedPost);
    }
    
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a comment to a post
router.post('/:id/comment', async (req, res) => {
  try {
    const { text, userName } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.comments.push({
      text,
      userName: userName || 'Anonymous',
    });
    
    const updatedPost = await post.save();
    
    // Emit new comment event
    const io = req.app.get('io');
    if (io) {
      io.emit('newComment', updatedPost);
    }
    
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;