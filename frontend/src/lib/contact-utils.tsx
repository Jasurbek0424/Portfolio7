import { Github, Linkedin, Mail, Instagram, Send, Link2 } from 'lucide-react';
import { isSafeUrl, type ContactItem } from '@/lib/api';

export const contactIcons: Record<string, React.ReactNode> = {
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

export const getIconKey = (c: ContactItem): string =>
  c.icon ?? (c.type === 'telegram' ? 'send' : c.type);

export const getContactHref = (c: ContactItem): string => {
  if (c.type === 'email') return `mailto:${c.value}`;
  return isSafeUrl(c.value) ? c.value : '#';
};

export const getContactDisplay = (c: ContactItem): string => {
  if (c.label) return c.label;
  if (c.type === 'email') return c.value;
  return c.value.replace(/^https?:\/\//, '').replace(/\/$/, '').replace('www.', '').replace('t.me/', '@');
};
