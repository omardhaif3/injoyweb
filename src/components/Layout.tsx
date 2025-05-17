import React, { useEffect } from 'react';
import Header from './Header';
import { useTranslation } from 'react-i18next';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Detect browser language on first visit
    const browserLang = navigator.language.split('-')[0];
    const supportedLanguages = ['en', 'ar'];
    const defaultLang = supportedLanguages.includes(browserLang) ? browserLang : 'en';

    if (!i18n.language || i18n.language === 'en') {
      i18n.changeLanguage(defaultLang);
    }

    // Set document direction based on language
    if (defaultLang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [i18n]);

  useEffect(() => {
    // Update direction on language change
    if (i18n.language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [i18n.language]);

  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
