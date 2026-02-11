import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="mb-6 font-mono text-8xl font-bold text-primary/20">404</div>
        <h1 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
          Page not found
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 ease-smooth hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 ease-smooth hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
