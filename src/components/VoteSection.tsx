import { useState } from 'react';
import { motion } from 'framer-motion';
import { VoteData, Option, Post } from '../types';
import { usePosts } from '../context/PostsContext';

interface VoteSectionProps {
  post: Post;
}

export default function VoteSection({ post }: VoteSectionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { vote } = usePosts();
  
  const handleOptionSelect = (optionId: string) => {
    if (hasVoted) return;
    setSelectedOption(optionId);
  };
  
  const handleVote = async () => {
    if (!selectedOption || hasVoted || isVoting) return;
    
    setIsVoting(true);
    
    const voteData: VoteData = {
      postId: post._id,
      optionId: selectedOption,
    };
    
    const success = await vote(voteData);
    
    if (success) {
      setHasVoted(true);
    }
    
    setIsVoting(false);
  };
  
  const calculatePercentage = (option: Option) => {
    if (post.totalVotes === 0) return 0;
    return Math.round((option.votes / post.totalVotes) * 100);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Cast your vote</h3>
      
      <div className="space-y-3">
        {post.options.map((option) => (
          <motion.div
            key={option._id}
            whileHover={{ scale: hasVoted ? 1 : 1.01 }}
            whileTap={{ scale: hasVoted ? 1 : 0.99 }}
            onClick={() => handleOptionSelect(option._id)}
            className={`p-4 rounded-lg ${
              hasVoted
                ? 'bg-white'
                : selectedOption === option._id
                ? 'bg-primary-50 border-2 border-primary-500 cursor-pointer'
                : 'bg-white border-2 border-gray-200 hover:border-primary-300 cursor-pointer'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{option.text}</span>
              {hasVoted && (
                <span className="text-primary-600 font-semibold">
                  {calculatePercentage(option)}%
                </span>
              )}
            </div>
            
            {hasVoted && (
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculatePercentage(option)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`absolute top-0 left-0 h-full rounded-full ${
                    selectedOption === option._id
                      ? 'bg-primary-500'
                      : 'bg-gray-400'
                  }`}
                />
              </div>
            )}
            
            {hasVoted && (
              <div className="mt-2 text-sm text-gray-600">
                {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {!hasVoted && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVote}
          disabled={!selectedOption || isVoting}
          className={`btn-primary w-full ${
            !selectedOption || isVoting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isVoting ? 'Voting...' : 'Vote Now'}
        </motion.button>
      )}
      
      {hasVoted && (
        <p className="text-center text-sm text-success-600 font-medium">
          Thanks for voting! Your opinion counts.
        </p>
      )}
      
      <div className="text-center text-sm text-gray-500">
        Total votes: {post.totalVotes}
      </div>
    </div>
  );
}