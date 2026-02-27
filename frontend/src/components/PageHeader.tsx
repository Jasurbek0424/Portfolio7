import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="mb-12"
  >
    <h1 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
    <p className="mt-3 text-muted-foreground">{subtitle}</p>
  </motion.div>
);

export default PageHeader;
