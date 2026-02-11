import type { SupportedLang } from '../config';

export const SUPPORTED_LANGS: SupportedLang[] = ['en', 'ru', 'uz'];
export const DEFAULT_LANG: SupportedLang = 'en';

export function parseLang(lang: string | undefined): SupportedLang {
  if (!lang) return DEFAULT_LANG;
  const normalized = lang.toLowerCase().slice(0, 2);
  if (SUPPORTED_LANGS.includes(normalized as SupportedLang)) {
    return normalized as SupportedLang;
  }
  return DEFAULT_LANG;
}

const NON_TRANSLATED = new Set(['id', 'createdAt', 'updatedAt', 'slug', 'published', 'sortOrder', 'techStack', 'thumbnail', 'linkUrl', 'githubUrl', 'sectionKey']);

export function toTranslatedResponse<T extends Record<string, unknown>>(
  obj: T,
  lang: SupportedLang
): Record<string, unknown> {
  const suffix = lang === 'en' ? 'En' : lang === 'ru' ? 'Ru' : 'Uz';
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key.endsWith('En') || key.endsWith('Ru') || key.endsWith('Uz')) {
      const baseName = key.slice(0, -2);
      const keySuffix = key.slice(-2);
      const targetSuffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
      if (keySuffix === targetSuffix) {
        result[baseName] = value;
      }
    } else if (!NON_TRANSLATED.has(key)) {
      result[key] = value;
    }
  }

  for (const key of NON_TRANSLATED) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}
