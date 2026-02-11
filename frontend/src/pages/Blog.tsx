import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2, ImageIcon } from 'lucide-react';
import { fadeUp } from '@/lib/animations';
import { useBlogs } from '@/hooks/useBlogs';
import { resolveUrl } from '@/lib/api';

const Blog = () => {
  const { t } = useLanguage();
  const { data: posts = [], isLoading } = useBlogs();

  return (
    <div className="min-h-screen pt-16">
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t('blog.title')}</h1>
          <p className="mt-3 text-muted-foreground">{t('blog.subtitle')}</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No blog posts yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card card-hover transition-smooth"
                >
                  {/* Thumbnail or placeholder */}
                  {resolveUrl(post.thumbnail) ? (
                    <div className="overflow-hidden">
                      <img
                        src={resolveUrl(post.thumbnail)!}
                        alt={post.title}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-secondary/50">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
                      {t('blog.readMore')} <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
