import { useLanguage } from '@/contexts/LanguageContext';
import { useContacts } from '@/hooks/useContacts';
import { contactIcons, getIconKey, getContactHref } from '@/lib/contact-utils';

const Footer = () => {
  const { t } = useLanguage();
  const { data: contacts = [], isError, refetch } = useContacts();

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">{t('footer.copyright')}</p>
        <div className="flex items-center gap-4">
          {isError && (
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm text-muted-foreground underline hover:text-primary"
            >
              {t('common.retry')}
            </button>
          )}
          {contacts.map((c) => (
            <a
              key={c.id}
              href={getContactHref(c)}
              target={c.type === 'email' ? undefined : '_blank'}
              rel={c.type === 'email' ? undefined : 'noopener noreferrer'}
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              title={c.label || c.value}
            >
              {contactIcons[getIconKey(c)] ?? contactIcons.other}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
