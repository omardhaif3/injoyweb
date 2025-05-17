import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import { usePosts } from '../context/PostsContext';
import PostCard from '../components/PostCard';
import FeaturedPostCard from '../components/FeaturedPostCard';
import { useTranslation } from 'react-i18next';
import { Post } from '../types';

export default function HomePage() {
  const { t } = useTranslation();
  const { posts, loading, error, refreshPosts } = usePosts();
  const [showFeatured, setShowFeatured] = useState(true);
  const [topPost, setTopPost] = useState<Post | null>(null);

  useEffect(() => {
    document.title = t('pageTitleHome');
  }, [t]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const sorted = [...posts].sort((a, b) => b.totalVotes - a.totalVotes);
      setTopPost(sorted[0]);
    }
  }, [posts]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-8">
      {showFeatured && topPost && (
        <FeaturedPostCard post={topPost} onClose={() => setShowFeatured(false)} />
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {t('welcomeTo')} <span className="text-primary-600">InJoy</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('homePageDescription')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/create" className="btn-primary flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" />
            {t('createYourFirstPost')}
          </Link>
          <button 
            onClick={() => refreshPosts()}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            {t('refreshFeed')}
          </button>
        </div>
      </motion.div>

      {loading && posts.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-error-600">{error}</p>
          <button 
            onClick={() => refreshPosts()}
            className="btn-outline mt-4"
          >
            {t('tryAgain')}
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">{t('noPostsYet')}</h2>
          <p className="text-gray-600 mt-2">{t('beTheFirstToCreatePost')}</p>
          <Link to="/create" className="btn-primary mt-6 inline-block">
            {t('createPost')}
          </Link>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {posts.map((post) => (
            <motion.div key={post._id} variants={item}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
