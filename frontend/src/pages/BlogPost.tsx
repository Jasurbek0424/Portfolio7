import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { getBlogBySlug, resolveUrl, type BlogPostPublic } from '@/lib/api';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();

  const { data: post, isLoading, isError } = useQuery<BlogPostPublic | null>({
    queryKey: ['blog', slug, language],
    queryFn: () => getBlogBySlug(slug!, language),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Blog post not found</h1>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> {t('blog.backToList') || 'Back to blog'}
          </Link>
        </div>
      </div>
    );
  }

  const thumbUrl = resolveUrl(post.thumbnail);
  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="min-h-screen pt-16">
      <article className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl"
        >
          {/* Back link */}
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> {t('blog.backToList') || 'Back to blog'}
          </Link>

          {/* Thumbnail */}
          {thumbUrl && (
            <div className="mb-8 overflow-hidden rounded-xl border border-border">
              <img
                src={thumbUrl}
                alt={post.title}
                loading="lazy"
                className="h-64 w-full object-cover md:h-96"
              />
            </div>
          )}

          {/* Meta */}
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>

          {/* Title */}
          <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">{post.title}</h1>

          {/* Content — rendered with react-markdown, sanitized */}
          <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed md:prose-base [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_a]:text-primary [&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-card">
            <ReactMarkdown>{sanitizedContent}</ReactMarkdown>
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;
