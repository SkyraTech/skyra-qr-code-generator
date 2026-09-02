'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showCopy?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'bash',
  showCopy = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border border-border bg-slate-950 p-3 text-xs text-slate-100 font-mono-data dark:bg-slate-900',
        className
      )}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400 font-sans uppercase tracking-wider">
        <span>{language}</span>
        {showCopy && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
      <pre className="mt-2 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
        {code}
      </pre>
    </div>
  );
}
