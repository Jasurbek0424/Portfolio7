import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'uz', label: 'UZ' },
];

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-mono text-lg font-bold text-foreground hover:text-primary transition-colors">
          {'<JK />'}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" />
              {language.toUpperCase()}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-8 rounded-lg border border-border bg-card p-1 shadow-lg"
                >
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`block w-full rounded-md px-4 py-1.5 text-left text-sm transition-colors hover:bg-secondary ${
                        language === lang.code ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-b border-border bg-background"
          >
            <div className="container mx-auto flex flex-col gap-3 px-4 py-4">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.to ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                    className={`rounded-md px-3 py-1 text-xs font-medium border transition-colors ${
                      language === lang.code
                        ? 'border-primary text-primary'
                        : 'border-border text-muted-foreground hover:border-primary'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
