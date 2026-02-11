import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Line {
  prompt: boolean;
  text: string;
}

const lines: Line[] = [
  { prompt: true, text: 'whoami' },
  { prompt: false, text: 'Jasurbek Khakimbekov' },
  { prompt: true, text: 'cat skills.json' },
  { prompt: false, text: '{ "frontend": ["React", "TypeScript", "Next.js"],' },
  { prompt: false, text: '  "tools": ["Git", "Docker", "Figma"],' },
  { prompt: false, text: '  "practices": ["Clean Code", "CI/CD"] }' },
  { prompt: true, text: 'echo $EXPERIENCE' },
  { prompt: false, text: '3+ years | 10+ commercial projects' },
  { prompt: true, text: 'echo "Open to work 🚀"' },
  { prompt: false, text: 'Open to work 🚀' },
];

function Typewriter({ text, speed = 35, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (displayed.length >= text.length) {
      onDone?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, text, speed, onDone]);

  return <>{displayed}</>;
}

export function HeroTerminal() {
  // currentLine: qaysi qatordamiz, typing: hali yozilyaptimi
  const [currentLine, setCurrentLine] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  // finished qatorlar (to'liq yozilganlar)
  const [finishedLines, setFinishedLines] = useState<number[]>([]);

  const handleLineDone = useCallback(() => {
    setFinishedLines((prev) => [...prev, currentLine]);
    setTypingDone(true);
  }, [currentLine]);

  // Keyingi qatorga o'tish
  useEffect(() => {
    if (!typingDone) return;
    if (currentLine >= lines.length - 1) return; // oxirgi qator

    const nextIsPrompt = lines[currentLine + 1]?.prompt;
    const delay = nextIsPrompt ? 500 : 150;

    const timer = setTimeout(() => {
      setCurrentLine((v) => v + 1);
      setTypingDone(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [typingDone, currentLine]);

  const allDone = finishedLines.length === lines.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">terminal</span>
      </div>

      {/* Terminal content — fixed height so it doesn't jump */}
      <div className="h-[320px] overflow-hidden p-5 font-mono text-sm leading-[1.8]">
        {lines.slice(0, currentLine + 1).map((line, i) => {
          const isFinished = finishedLines.includes(i);
          const isCurrent = i === currentLine;
          const speed = line.prompt ? 50 : 20; // prompt sekinroq, javob tezroq

          return (
            <div key={i} className="flex">
              {line.prompt ? (
                <>
                  <span className="mr-2 select-none text-green-400">➜</span>
                  <span className="mr-2 select-none text-primary">~</span>
                  <span className="text-foreground">
                    {isFinished ? (
                      line.text
                    ) : isCurrent ? (
                      <Typewriter text={line.text} speed={speed} onDone={handleLineDone} />
                    ) : null}
                  </span>
                </>
              ) : (
                <span className="ml-[1.85rem] text-muted-foreground">
                  {isFinished ? (
                    line.text
                  ) : isCurrent ? (
                    <Typewriter text={line.text} speed={speed} onDone={handleLineDone} />
                  ) : null}
                </span>
              )}
            </div>
          );
        })}

        {/* Blinking cursor */}
        {allDone && (
          <div className="flex items-center">
            <span className="mr-2 select-none text-green-400">➜</span>
            <span className="mr-2 select-none text-primary">~</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
              className="inline-block h-[1.1em] w-2 bg-primary"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
