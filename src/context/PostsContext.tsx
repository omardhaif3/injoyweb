import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import { Post, CreatePostData, VoteData, CommentData } from '../types';
import { fetchPosts, createPost, voteOnPost, addComment } from '../api/posts';
import { useToast } from '../hooks/useToast';

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  createNewPost: (data: CreatePostData) => Promise<Post | null>;
  vote: (data: VoteData) => Promise<boolean>;
  comment: (data: CommentData) => Promise<boolean>;
  refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();
  const { showToast } = useToast();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      showToast({
        title: 'Error',
        description: 'Failed to load posts',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewPost = (newPost: Post) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    const handleVote = (updatedPost: Post) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    };

    const handleNewComment = (updatedPost: Post) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    };

    socket.on('newPost', handleNewPost);
    socket.on('vote', handleVote);
    socket.on('newComment', handleNewComment);

    return () => {
      socket.off('newPost', handleNewPost);
      socket.off('vote', handleVote);
      socket.off('newComment', handleNewComment);
    };
  }, [socket]);

  const createNewPost = async (data: CreatePostData): Promise<Post | null> => {
    try {
      setLoading(true);
      const newPost = await createPost(data);
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      showToast({
        title: 'Success',
        description: 'Your post has been created!',
        type: 'success',
      });
      return newPost;
    } catch (err) {
      setError('Failed to create post. Please try again.');
      showToast({
        title: 'Error',
        description: 'Failed to create post',
        type: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const vote = async (data: VoteData): Promise<boolean> => {
    try {
      const updatedPost = await voteOnPost(data);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
      showToast({
        title: 'Vote recorded',
        description: 'Your vote has been counted!',
        type: 'success',
      });
      return true;
    } catch (err) {
      showToast({
        title: 'Error',
        description: 'Failed to record your vote',
        type: 'error',
      });
      return false;
    }
  };

  const comment = async (data: CommentData): Promise<boolean> => {
    try {
      const updatedPost = await addComment(data);
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
      showToast({
        title: 'Comment added',
        type: 'success',
      });
      return true;
    } catch (err) {
      showToast({
        title: 'Error',
        description: 'Failed to add your comment',
        type: 'error',
      });
      return false;
    }
  };

  const refreshPosts = async (): Promise<void> => {
    await loadPosts();
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        error,
        createNewPost,
        vote,
        comment,
        refreshPosts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};