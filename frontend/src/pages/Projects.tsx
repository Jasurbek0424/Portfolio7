import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Loader2, ImageOff } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import { useProjects } from '@/hooks/useProjects';
import { resolveUrl, isSafeUrl } from '@/lib/api';
import PageHeader from '@/components/PageHeader';

const Projects = () => {
  const { t } = useLanguage();
  const { data: projects = [], isLoading: loading } = useProjects();
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((p) => p.techStack?.forEach((tech) => techSet.add(tech)));
    return ['All', ...Array.from(techSet).sort()];
  }, [projects]);

  const filtered =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.techStack?.includes(activeFilter));

  return (
    <div className="min-h-screen pt-16">
      <section className="container mx-auto px-4 py-20">
        <PageHeader title={t('projects.title')} subtitle={t('projects.subtitle')} />

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
              {filtered.map((project, i) => {
                const thumbUrl = resolveUrl(project.thumbnail);
                return (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card-hover overflow-hidden rounded-xl border border-border bg-card"
                >
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={project.title}
                      loading="lazy"
                      className="h-52 w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-secondary/50 border-b border-border">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                        <ImageOff className="h-10 w-10" />
                        <span className="text-xs font-medium">No Image</span>
                      </div>
                    </div>
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
                );
              })}
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
