import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Github, Linkedin, Mail, Instagram, Send, Link2 } from 'lucide-react';
import { getContactInfo, type ContactItem } from '@/lib/api';

const footerIcons: Record<string, React.ReactNode> = {
  mail: <Mail className="h-5 w-5" />,
  email: <Mail className="h-5 w-5" />,
  github: <Github className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
  send: <Send className="h-5 w-5" />,
  telegram: <Send className="h-5 w-5" />,
  link: <Link2 className="h-5 w-5" />,
  other: <Link2 className="h-5 w-5" />,
};

const getIconKey = (c: ContactItem) =>
  c.icon ?? (c.type === 'telegram' ? 'send' : c.type);

const Footer = () => {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [contactsError, setContactsError] = useState(false);

  function loadContacts() {
    setContactsError(false);
    getContactInfo().then(setContacts).catch(() => setContactsError(true));
  }

  useEffect(() => {
    loadContacts();
  }, []);

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">{t('footer.copyright')}</p>
        <div className="flex items-center gap-4">
          {contactsError && (
            <button
              type="button"
              onClick={loadContacts}
              className="text-sm text-muted-foreground underline hover:text-primary"
            >
              {t('common.retry')}
            </button>
          )}
          {contacts?.map((c) => (
            <a
              key={c.id}
              href={c.type === 'email' ? `mailto:${c.value}` : c.value}
              target={c.type === 'email' ? undefined : '_blank'}
              rel={c.type === 'email' ? undefined : 'noopener noreferrer'}
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              title={c.label || c.value}
            >
              {footerIcons[getIconKey(c)] ?? footerIcons.other}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
