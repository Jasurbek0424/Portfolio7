import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { getCvDownloadUrl } from '@/lib/api';
import { PixelLoader } from '@/components/PixelLoader';
import { HeroTerminal } from '@/components/HeroTerminal';

const IndexBelowFold = lazy(() => import('./IndexBelowFold'));

const Index = () => {
  const { t } = useLanguage();
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvError, setCvError] = useState(false);

  function loadCv() {
    setCvError(false);
    getCvDownloadUrl().then(setCvUrl).catch(() => setCvError(true));
  }

  useEffect(() => {
    loadCv();
  }, []);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl flex-1"
          >
            <p className="mb-3 font-mono text-sm text-primary">{'> hello_world'}</p>
            <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl">
              {t('hero.name')}
            </h1>
            <p className="mb-3 font-mono text-lg text-gradient md:text-xl">
              {t('hero.title')}
            </p>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {t('hero.bio')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 ease-smooth hover:glow-primary hover:brightness-110"
              >
                {t('hero.viewProjects')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 ease-smooth hover:border-primary hover:text-primary"
              >
                {t('hero.contactMe')}
              </Link>
              {cvUrl ? (
                <a
                  href={cvUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 ease-smooth hover:border-primary hover:text-primary"
                >
                  <Download className="h-4 w-4" /> {t('hero.downloadCV')}
                </a>
              ) : cvError ? (
                <button
                  type="button"
                  onClick={loadCv}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 ease-smooth hover:border-primary hover:text-primary"
                >
                  <Download className="h-4 w-4" /> {t('common.retry')}
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground/70">
                  <Download className="h-4 w-4" /> {t('hero.downloadCV')}
                </span>
              )}
            </div>
          </motion.div>

          {/* Right — terminal animation (desktop only) */}
          <div className="hidden w-full max-w-lg flex-shrink-0 lg:block xl:max-w-xl">
            <HeroTerminal />
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center border-t border-border">
            <PixelLoader />
          </div>
        }
      >
        <IndexBelowFold />
      </Suspense>
    </div>
  );
};

export default Index;
