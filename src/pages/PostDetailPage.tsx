import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Copy, 
  ArrowLeft, 
  Vote, 
  MessageCircle, 
  Clock 
} from 'lucide-react';
import { usePosts } from '../context/PostsContext';
import { getPostById } from '../api/posts';
import { Post } from '../types';
import VoteSection from '../components/VoteSection';
import CommentSection from '../components/CommentSection';
import { formatDate } from '../utils/formatters';
import { useToast } from '../hooks/useToast';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const { posts } = usePosts();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    async function loadPost() {
      if (!postId) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }
      
      try {
        // First check if we already have this post in our context
        const existingPost = posts.find(p => p._id === postId);
        
        if (existingPost) {
          setPost(existingPost);
          setLoading(false);
          return;
        }
        
        // If not, fetch it from the API
        const fetchedPost = await getPostById(postId);
        setPost(fetchedPost);
        setError(null);
      } catch (err) {
        setError('Failed to load post. It may have been deleted or is unavailable.');
      } finally {
        setLoading(false);
      }
    }
    
    loadPost();
  }, [postId, posts]);
  
  useEffect(() => {
    if (post) {
      document.title = `${post.question} - InJoy`;
    } else {
      document.title = 'Loading Post - InJoy';
    }
  }, [post]);
  
  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.question || 'InJoy Post',
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        
        showToast({
          title: 'Link copied to clipboard',
          type: 'success',
        });
        
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {error || 'Post not found'}
        </h2>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="btn-outline flex items-center gap-2"
          >
            {copied ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Share'}
          </motion.button>
        </div>
        
        <div className="card p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {post.question}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Vote className="h-4 w-4" />
              <span>{post.totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length} comments</span>
            </div>
          </div>
          
          <VoteSection post={post} />
        </div>
        
        <div className="card p-6">
          <CommentSection post={post} />
        </div>
      </motion.div>
    </div>
  );
}