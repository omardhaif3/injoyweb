import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Post, CommentData } from '../types';
import { usePosts } from '../context/PostsContext';
import { formatDate } from '../utils/formatters';
import { useTranslation } from 'react-i18next';

interface CommentSectionProps {
  post: Post;
}

export default function CommentSection({ post }: CommentSectionProps) {
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { comment } = usePosts();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    const commentData: CommentData = {
      postId: post._id,
      text: commentText,
      userName: userName.trim() || t('anonymous'),
    };
    
    const success = await comment(commentData);
    
    if (success) {
      setCommentText('');
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t('comments')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="userName" className="label">{t('yourNameOptional')}</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder={t('anonymous')}
            className="input"
            maxLength={30}
          />
        </div>
        
        <div>
          <label htmlFor="commentText" className="label">{t('yourComment')}</label>
          <textarea
            id="commentText"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t('shareYourThoughts')}
            className="textarea min-h-24"
            maxLength={500}
            required
          />
        </div>
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            className={`btn-primary flex items-center gap-2 ${
              !commentText.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? t('posting') : t('postComment')}
          </motion.button>
        </div>
      </form>
      
      <div className="space-y-4">
        {post.comments.length === 0 ? (
          <p className="text-center py-8 text-gray-500 italic">
            {t('noCommentsYet')}
          </p>
        ) : (
          post.comments.map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">
                  {comment.userName || t('anonymous')}
                </h4>
                <span className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{comment.text}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
