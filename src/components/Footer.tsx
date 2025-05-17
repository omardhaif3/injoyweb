import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} InJoy. {t('allRightsReserved')}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            {t('madeWith')} <Heart className="h-4 w-4 text-secondary-500 animate-pulse-slow" /> {t('forCuriousMinds')}
          </div>
        </div>
      </div>
    </footer>
  );
}
