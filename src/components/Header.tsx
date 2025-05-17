import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PartyPopper, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    if (lng === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
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
          
          <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              {t('home')}
            </Link>
            <Link 
              to="/create" 
              className="btn-primary flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              {t('createPost')}
            </Link>
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="ml-4 px-2 py-1 border rounded"
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
