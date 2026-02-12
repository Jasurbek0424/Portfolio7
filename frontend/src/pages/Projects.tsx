import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Loader2 } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import { useProjects } from '@/hooks/useProjects';
import { resolveUrl, isSafeUrl } from '@/lib/api';

const filters = ['All', 'React', 'Python', 'AI'];

const Projects = () => {
  const { t } = useLanguage();
  const { data: projects = [], isLoading: loading } = useProjects();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.techStack?.includes(activeFilter));

  return (
    <div className="min-h-screen pt-16">
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t('projects.title')}</h1>
          <p className="mt-3 text-muted-foreground">{t('projects.subtitle')}</p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-lg border px-4 py-1.5 font-mono text-xs font-medium transition-all duration-300 ease-smooth ${
                activeFilter === f
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {f === 'All' ? t('projects.all') : f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card-hover overflow-hidden rounded-xl border border-border bg-card"
                >
                  {resolveUrl(project.thumbnail) && (
                    <img
                      src={resolveUrl(project.thumbnail)!}
                      alt={project.title}
                      className="h-44 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  {project.techStack?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border bg-secondary px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex gap-3">
                    {project.githubUrl && isSafeUrl(project.githubUrl) && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
                      >
                        <Github className="h-3.5 w-3.5" /> {t('projects.github')}
                      </a>
                    )}
                    {project.linkUrl && isSafeUrl(project.linkUrl) && (
                      <a
                        href={project.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:brightness-110"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> {t('projects.demo')}
                      </a>
                    )}
                  </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="py-12 text-center text-muted-foreground">No projects match the filter.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Projects;
