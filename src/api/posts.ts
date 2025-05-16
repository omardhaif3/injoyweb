import axios from 'axios';
import { Post, CreatePostData, VoteData, CommentData } from '../types';

// const API_URL = 'http://localhost:3001/api';
const API_URL = 'https://injoyweb.onrender.com/api';


export const fetchPosts = async (): Promise<Post[]> => {
  const response = await axios.get<Post[]>(`${API_URL}/posts`);
  return response.data;
};

export const getPostById = async (postId: string): Promise<Post> => {
  const response = await axios.get<Post>(`${API_URL}/posts/${postId}`);
  return response.data;
};

export const createPost = async (data: CreatePostData): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/posts`, data);
  return response.data;
};

export const voteOnPost = async (data: VoteData): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/posts/${data.postId}/vote`, {
    optionId: data.optionId,
  });
  return response.data;
};

export const addComment = async (data: CommentData): Promise<Post> => {
  const response = await axios.post<Post>(`${API_URL}/posts/${data.postId}/comment`, {
    text: data.text,
    userName: data.userName || 'Anonymous',
  });
  return response.data;
};