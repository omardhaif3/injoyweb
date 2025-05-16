import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { usePosts } from '../context/PostsContext';
import { CreatePostData } from '../types';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { createNewPost } = usePosts();
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  useEffect(() => {
    document.title = 'Create New Post - InJoy';
  }, []);
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Clear error for this option if it exists
    if (errors[`option${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`option${index}`];
      setErrors(newErrors);
    }
  };
  
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };
  
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      
      // Remove any errors for this option
      if (errors[`option${index}`]) {
        const newErrors = { ...errors };
        delete newErrors[`option${index}`];
        setErrors(newErrors);
      }
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!question.trim()) {
      newErrors.question = 'Question is required';
    } else if (question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters';
    }
    
    options.forEach((option, index) => {
      if (!option.trim()) {
        newErrors[`option${index}`] = 'Option cannot be empty';
      }
    });
    
    const uniqueOptions = new Set(options.map(opt => opt.trim()));
    if (uniqueOptions.size !== options.length) {
      newErrors.options = 'All options must be unique';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    const postData: CreatePostData = {
      question,
      options: options.map(option => option.trim()),
    };
    
    const newPost = await createNewPost(postData);
    
    setIsSubmitting(false);
    
    if (newPost) {
      navigate(`/posts/${newPost._id}`);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        </div>
        
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="question" className="label">
                Your Question or Statement
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (errors.question) {
                    const newErrors = { ...errors };
                    delete newErrors.question;
                    setErrors(newErrors);
                  }
                }}
                placeholder="e.g., What's your favorite programming language?"
                className={`textarea min-h-24 ${
                  errors.question ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''
                }`}
                maxLength={300}
              />
              {errors.question && (
                <p className="mt-1 text-sm text-error-600">{errors.question}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {question.length}/300 characters
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="label">Voting Options</label>
                {errors.options && (
                  <p className="text-sm text-error-600">{errors.options}</p>
                )}
              </div>
              
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className={`input ${
                        errors[`option${index}`]
                          ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                          : ''
                      }`}
                      maxLength={100}
                    />
                    {errors[`option${index}`] && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors[`option${index}`]}
                      </p>
                    )}
                  </div>
                  
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-gray-400 hover:text-error-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              
              {options.length < 6 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={addOption}
                  className="btn-outline flex items-center gap-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add Option
                </motion.button>
              )}
            </div>
            
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary w-full ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating Post...' : 'Create Post'}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}