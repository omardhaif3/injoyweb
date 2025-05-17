import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types';
import { useTranslation } from 'react-i18next';

interface FeaturedPostCardProps {
  post: Post;
  onClose: () => void;
}

export default function FeaturedPostCard({ post, onClose }: FeaturedPostCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    onClose();
    navigate(`/posts/${post._id}`);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="featured-post-title"
    >
      <div 
        className="bg-white rounded-lg shadow-lg max-w-md w-full cursor-pointer relative border border-primary-600 p-6"
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
      >
        <h2 id="featured-post-title" className="text-center text-xl font-semibold mb-4 text-primary-600">
          {t('mostVotedPostIs')}
        </h2>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{post.question}</h3>
        <p className="text-gray-700 line-clamp-3 mb-4">
          {post.options.length > 0 ? post.options[0].text : ''}
        </p>
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>{post.totalVotes} {t('votes')}</span>
          <span>{post.comments.length} {t('comments')}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label={t('close')}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
