import { Routes, Route } from 'react-router-dom';
import { Toaster, ToastProvider } from './components/ui/Toaster';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { PostsProvider } from './context/PostsContext';
import { SocketProvider } from './context/SocketContext';
import PopularPostsPage from './pages/PopularPostsPage';

function App() {
  return (
    <ToastProvider>
      <SocketProvider>
        <PostsProvider>
          <Toaster />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path="/posts/:postId" element={<PostDetailPage />} />
               <Route path="/popular" element={<PopularPostsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </PostsProvider>
      </SocketProvider>
    </ToastProvider>
  );
}

export default App;