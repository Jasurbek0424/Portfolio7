import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Code2, MapPin } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import { useSkills } from '@/hooks/useSkills';
import { PixelLoader } from '@/components/PixelLoader';
import type { Language } from '@/i18n/translations';

function calcDuration(start: Date, end: Date, lang: Language): string {
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 1) months = 1;
  const years = Math.floor(months / 12);
  const remainMonths = months % 12;

  const labels: Record<Language, { yr: string; mo: string }> = {
    en: { yr: 'yr', mo: 'mo' },
    ru: { yr: 'г.', mo: 'мес.' },
    uz: { yr: 'yil', mo: 'oy' },
  };
  const l = labels[lang];

  if (years > 0 && remainMonths > 0) return `${years} ${l.yr} ${remainMonths} ${l.mo}`;
  if (years > 0) return `${years} ${l.yr}`;
  return `${remainMonths} ${l.mo}`;
}

/** Highlights metrics like "25%", "~15%" inside a bullet, resume-style. */
function renderBullet(text: string) {
  const parts = text.split(/(~?\d+%)/g);
  return parts.map((part, idx) =>
    /^~?\d+%$/.test(part) ? (
      <span key={idx} className="font-semibold text-foreground">{part}</span>
    ) : (
      part
    ),
  );
}

/** "Company · City, Country" → { company, location } */
function splitCompany(value: string) {
  const [company, ...rest] = value.split(' · ');
  return { company, location: rest.join(' · ') };
}

export default function IndexBelowFold() {
  const { t, language } = useLanguage();
  const { data: skillCategories = [], isLoading: skillsLoading, isError: skillsError, refetch: loadSkills } = useSkills();

  const now = useMemo(() => new Date(), []);

  const experiences = useMemo(() => [
    { id: 'uzinfocom', start: new Date(2026, 5), end: now, current: true, stack: ['React', 'TypeScript', 'Design System', 'Accessibility', 'Performance'] },
    { id: 'mars', current: false, start: new Date(2025, 3), end: new Date(2026, 5), stack: ['React', 'Node.js', 'E-commerce', 'Code Review', 'Mentoring'] },
    { id: 'uravo', current: false, start: new Date(2024, 9), end: new Date(2025, 9), stack: ['React', 'TypeScript', 'REST API', 'Zoom', 'AI'] },
    { id: 'aiva', current: false, start: new Date(2023, 11), end: new Date(2024, 4), stack: ['React', 'Django', 'TypeScript', 'Laravel'] },
    { id: 'junior', current: false, start: new Date(2022, 4), end: new Date(2023, 11), stack: ['React', 'Python', 'Telegram Bots', 'Google Sheets'] },
    { id: 'itstep', current: false, start: new Date(2022, 0), end: new Date(2022, 4), stack: [] as string[] },
  ].map((e) => ({
    ...e,
    title: t(`exp.${e.id}.title`),
    date: t(`exp.${e.id}.date`),
    ...splitCompany(t(`exp.${e.id}.company`)),
    bullets: t(`exp.${e.id}.desc`).split('\n').filter(Boolean),
  })), [t, now]);

  const education = useMemo(() => [
    { degree: t('edu.masters.degree'), school: t('edu.masters.school'), location: t('edu.masters.location') },
    { degree: t('edu.bachelors.degree'), school: t('edu.bachelors.school'), location: t('edu.bachelors.location') },
  ], [t]);

  return (
    <>
      {/* Skills */}
      <section className="border-t border-border py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="flex items-center gap-3 text-2xl font-bold text-foreground md:text-3xl">
              <Code2 className="h-6 w-6 text-primary" /> {t('skills.title')}
            </motion.h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2">
            {skillsLoading && (
              <div className="col-span-2 flex justify-center py-8">
                <PixelLoader />
              </div>
            )}
            {skillsError && !skillsLoading && (
              <div className="col-span-2 flex flex-col items-center gap-3 py-8">
                <p className="text-center text-sm text-muted-foreground">{t('common.loadError')}</p>
                <button
                  type="button"
                  onClick={() => loadSkills()}
                  className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {t('common.retry')}
                </button>
              </div>
            )}
            {!skillsLoading && !skillsError && skillCategories.length > 0 && skillCategories.map((cat, catIdx) => (
              <motion.div
                key={cat.id}
                variants={fadeUp}
                custom={catIdx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-card p-6 card-hover"
              >
                <h3 className="mb-4 font-mono text-sm font-semibold text-primary">{cat.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-md border border-border bg-secondary px-3 py-1 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {skill.label}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
            {!skillsLoading && !skillsError && skillCategories.length === 0 && (
              <p className="col-span-2 text-center text-sm text-muted-foreground">{t('skills.empty')}</p>
            )}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="border-t border-border py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 flex items-center gap-3 text-2xl font-bold text-foreground md:text-3xl"
          >
            <Briefcase className="h-6 w-6 text-primary" /> {t('experience.title')}
          </motion.h2>
          <ol className="relative space-y-6 border-l border-border pl-6 md:ml-4 md:pl-10">
            {experiences.map((exp, i) => (
              <motion.li
                key={exp.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative"
              >
                {/* Timeline dot */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.95rem] top-7 flex h-3 w-3 items-center justify-center md:-left-[2.95rem]"
                >
                  {exp.current && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />}
                  <span className={`relative inline-flex h-3 w-3 rounded-full border-2 border-primary ${exp.current ? 'bg-primary' : 'bg-background'}`} />
                </span>

                <article className="rounded-xl border border-border bg-card p-5 card-hover md:p-6">
                  {/* Header: role + dates, like the CV */}
                  <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold leading-snug text-foreground">{exp.title}</h3>
                      <p className="mt-1 text-sm font-medium text-primary">{exp.company}</p>
                      {exp.location && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                          {exp.location}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
                      <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">{exp.date}</span>
                      <span className="whitespace-nowrap rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-primary">
                        {calcDuration(exp.start, exp.end, language)}
                      </span>
                    </div>
                  </header>

                  {/* Achievements */}
                  <ul className="mt-4 space-y-2">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className="relative pl-5 text-sm leading-relaxed text-muted-foreground">
                        <span aria-hidden="true" className="absolute left-0 top-[0.6rem] h-1.5 w-1.5 rounded-full bg-primary/70" />
                        {renderBullet(b)}
                      </li>
                    ))}
                  </ul>

                  {exp.stack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
                      {exp.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[11px] text-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Education */}
      <section className="border-t border-border py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 flex items-center gap-3 text-2xl font-bold text-foreground md:text-3xl"
          >
            <GraduationCap className="h-6 w-6 text-primary" /> {t('education.title')}
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            {education.map((edu, i) => (
              <motion.div
                key={edu.school}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-card p-6 card-hover"
              >
                <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                <p className="mt-1 text-sm text-primary">{edu.school}</p>
                <p className="mt-1 text-xs text-muted-foreground">{edu.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
