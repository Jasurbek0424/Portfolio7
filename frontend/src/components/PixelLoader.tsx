import { cn } from '@/lib/utils';

const SEGMENTS = 5;

export function PixelLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-lg bg-background p-6',
        className
      )}
      role="status"
      aria-label="Loading"
    >
      {/* Segmented progress bar - pixel outline, primary fill */}
      <div className="h-6 w-48 shrink-0 rounded-none border-2 border-primary bg-background p-0.5">
        <div className="flex h-full gap-0.5">
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className="h-full flex-1 shrink-0 rounded-none bg-primary animate-pixel-segment"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
      {/* LOADING text - pixel / blocky */}
      <p
        className="font-mono text-sm font-bold uppercase tracking-[0.35em] text-primary"
        style={{ fontFamily: 'var(--heading-font)' }}
      >
        LOADING
      </p>
    </div>
  );
}
