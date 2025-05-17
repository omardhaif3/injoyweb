import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PartyPopper, Plus, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [menuOpen, setMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    if (lng === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            >
              <PartyPopper className="h-6 w-6 text-primary-600" />
            </motion.div>
            <span className="font-bold text-xl text-primary-600">{t('brand')}</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Navigation */}
          <nav className={`flex-col sm:flex-row sm:flex items-center gap-2 sm:gap-4 absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-md sm:shadow-none transition-transform transform sm:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 z-20`}>
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link 
              to="/create" 
              className="btn-primary flex items-center gap-1"
              onClick={() => setMenuOpen(false)}
            >
              <Plus className="h-4 w-4" />
              {t('createPost')}
            </Link>
            <Link
              to="/popular"
              className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/popular'
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {t('popularPosts')}
            </Link>
            <select
              value={lang}
              onChange={(e) => {
                changeLanguage(e.target.value);
                setMenuOpen(false);
              }}
              className="ml-4 px-2 py-1 border rounded mt-2 sm:mt-0"
              aria-label={t('language')}
            >
              <option value="en">🇺🇸 {t('english')}</option>
              <option value="ar">🇸🇦 {t('arabic')}</option>
            </select>
          </nav>
        </div>
      </div>
    </header>
  );
}
