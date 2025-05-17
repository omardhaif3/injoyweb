import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Vote } from 'lucide-react';
import { Post } from '../types';
import { formatDate } from '../utils/formatters';
import { useTranslation } from 'react-i18next';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  const { _id, question, options, totalVotes, comments, createdAt } = post;
  
  // Calculate a gradient based on the post id
  const gradientColors = [
    ['from-primary-100', 'to-primary-50'],
    ['from-secondary-100', 'to-secondary-50'],
    ['from-accent-100', 'to-accent-50'],
    ['from-primary-100', 'to-secondary-50'],
    ['from-accent-100', 'to-primary-50'],
  ];
  
  const gradientIndex = parseInt(_id.slice(-1), 16) % gradientColors.length;
  const [from, to] = gradientColors[gradientIndex];
  
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`card hover:shadow-lg bg-gradient-to-br ${from} ${to}`}
    >
      <Link to={`/posts/${_id}`} className="block p-4 sm:p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2">{question}</h3>
        
        <div className="space-y-3 mb-4">
          {options.slice(0, 2).map((option) => (
            <div key={option._id} className="bg-white bg-opacity-70 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">{option.text}</span>
                <span className="text-sm text-gray-600">
                  {totalVotes > 0
                    ? Math.round((option.votes / totalVotes) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ 
                    width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
          {options.length > 2 && (
            <p className="text-sm text-gray-600 italic">
              {t('moreOptions', { count: options.length - 2 })}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Vote className="h-4 w-4" />
              <span>{totalVotes} {t('votes')}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{comments.length} {t('comments')}</span>
            </div>
          </div>
          <span>{formatDate(createdAt)}</span>
        </div>
      </Link>
    </motion.div>
  );
}
