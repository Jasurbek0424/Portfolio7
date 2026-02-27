import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { sendContactMessage } from '@/lib/api';
import { useContacts } from '@/hooks/useContacts';
import { contactIcons, getIconKey, getContactHref, getContactDisplay } from '@/lib/contact-utils';
import PageHeader from '@/components/PageHeader';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  message: z.string().trim().min(1, 'Required').max(2000),
});

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const { data: contacts = [], isLoading: contactsLoading, isError: contactsError, refetch } = useContacts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSendError(null);
    setSending(true);
    const { success, error } = await sendContactMessage(form);
    setSending(false);
    if (success) {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setForm({ name: '', email: '', message: '' });
    } else {
      setSendError(error || 'Message could not be sent');
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="container mx-auto px-4 py-20">
        <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />

        <div className="grid gap-12 md:grid-cols-2">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('contact.name')}</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('contact.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('contact.message')}</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
            </div>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 hover:glow-primary disabled:opacity-60 disabled:pointer-events-none"
            >
              <Send className="h-4 w-4" /> {sending ? t('contact.sendSending') : t('contact.send')}
            </button>
            {sent && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-primary"
              >
                <CheckCircle className="h-4 w-4" /> {t('contact.success')}
              </motion.p>
            )}
            {sendError && (
              <p className="text-sm text-destructive">{sendError}</p>
            )}
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="mb-6 font-mono text-sm font-semibold text-primary">{t('contact.info')}</h3>
            <div className="space-y-5">
              {contactsLoading && (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}
              {!contactsLoading && contacts.length > 0 && contacts.map((c) => (
                <a
                  key={c.id}
                  href={getContactHref(c)}
                  target={c.type === 'email' ? undefined : '_blank'}
                  rel={c.type === 'email' ? undefined : 'noopener noreferrer'}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {contactIcons[getIconKey(c)] ?? contactIcons.link}
                  {getContactDisplay(c)}
                </a>
              ))}
              {contactsError && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">{t('common.loadError')}</p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="w-fit rounded-lg border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {t('common.retry')}
                  </button>
                </div>
              )}
              {!contactsLoading && !contactsError && contacts.length === 0 && (
                <p className="text-sm text-muted-foreground">No contact info configured yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
