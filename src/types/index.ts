export interface Post {
  _id: string;
  question: string;
  options: Option[];
  totalVotes: number;
  createdAt: string;
  comments: Comment[];
}

export interface Option {
  _id: string;
  text: string;
  votes: number;
}

export interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userName?: string;
}

export interface CreatePostData {
  question: string;
  options: string[];
}

export interface VoteData {
  postId: string;
  optionId: string;
}

export interface CommentData {
  postId: string;
  text: string;
  userName?: string;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}