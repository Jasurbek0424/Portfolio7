import { PixelLoader } from '@/components/PixelLoader';

export function AppPreloader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <PixelLoader className="p-0" />
    </div>
  );
}
