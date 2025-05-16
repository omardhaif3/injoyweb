import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    default: 'Anonymous',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [optionSchema],
  totalVotes: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for counting total votes
postSchema.virtual('votesCount').get(function() {
  return this.options.reduce((total, option) => total + option.votes, 0);
});

// Pre-save hook to update totalVotes
postSchema.pre('save', function(next) {
  this.totalVotes = this.options.reduce((total, option) => total + option.votes, 0);
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;