import React, { useEffect, useState } from 'react';
import { usePosts } from '../context/PostsContext';
import PostCard from '../components/PostCard';
import { useTranslation } from 'react-i18next';
import { Post } from '../types';

export default function PopularPostsPage() {
  const { posts } = usePosts();
  const { t } = useTranslation();
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const sorted = [...posts].sort((a, b) => {
        const votesDiff = b.totalVotes - a.totalVotes;
        if (votesDiff !== 0) return votesDiff;
        return b.comments.length - a.comments.length;
      });
      setSortedPosts(sorted);
    }
  }, [posts]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('popularPosts')}</h1>
      {sortedPosts.length === 0 ? (
        <p>{t('loading')}</p>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
