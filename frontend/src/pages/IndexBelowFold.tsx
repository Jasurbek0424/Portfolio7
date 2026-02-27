import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Code2 } from 'lucide-react';
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

export default function IndexBelowFold() {
  const { t, language } = useLanguage();
  const { data: skillCategories = [], isLoading: skillsLoading, isError: skillsError, refetch: loadSkills } = useSkills();

  const now = useMemo(() => new Date(), []);

  const experiences = useMemo(() => [
    { title: t('exp.mars.title'), company: t('exp.mars.company'), date: t('exp.mars.date'), desc: t('exp.mars.desc'), start: new Date(2025, 3), end: now },
    { title: t('exp.uravo.title'), company: t('exp.uravo.company'), date: t('exp.uravo.date'), desc: t('exp.uravo.desc'), start: new Date(2024, 9), end: new Date(2025, 10) },
    { title: t('exp.aiva.title'), company: t('exp.aiva.company'), date: t('exp.aiva.date'), desc: t('exp.aiva.desc'), start: new Date(2023, 11), end: new Date(2024, 4) },
    { title: t('exp.junior.title'), company: t('exp.junior.company'), date: t('exp.junior.date'), desc: t('exp.junior.desc'), start: new Date(2022, 4), end: new Date(2023, 11) },
    { title: t('exp.itstep.title'), company: t('exp.itstep.company'), date: t('exp.itstep.date'), desc: t('exp.itstep.desc'), start: new Date(2022, 0), end: new Date(2022, 4) },
  ], [t, now]);

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
          <div className="relative ml-4 border-l border-border pl-8">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative mb-10 last:mb-0"
              >
                <div className="absolute -left-[2.55rem] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                <p className="font-mono text-xs text-muted-foreground">
                  {exp.date}
                  <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    {calcDuration(exp.start, exp.end, language)}
                  </span>
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{exp.title}</h3>
                <p className="text-sm text-primary">{exp.company}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{exp.desc}</p>
              </motion.div>
            ))}
          </div>
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
