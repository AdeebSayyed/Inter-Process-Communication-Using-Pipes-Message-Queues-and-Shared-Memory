import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  title: string;
  language: string;
  code: string;
}

const CodeBlock = ({ title, language, code }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-window"
    >
      <div className="terminal-header justify-between">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-destructive" />
          <div className="terminal-dot bg-accent" />
          <div className="terminal-dot bg-secondary" />
          <span className="ml-3 text-sm text-muted-foreground font-mono">
            {title}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-secondary" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto">
        <pre className="text-sm">
          <code className="text-foreground">
            {code.split("\n").map((line, i) => (
              <div key={i} className="flex">
                <span className="text-muted-foreground w-8 select-none text-right pr-4">
                  {i + 1}
                </span>
                <span className="flex-1">
                  {line.split(/(\b(?:int|char|void|struct|if|else|return|include|define)\b|\/\/.*$|"[^"]*"|'[^']*'|\b\d+\b)/g).map((part, j) => {
                    if (/^(int|char|void|struct|if|else|return)$/.test(part)) {
                      return <span key={j} className="text-ipc-pipe">{part}</span>;
                    }
                    if (/^(include|define)$/.test(part)) {
                      return <span key={j} className="text-ipc-memory">{part}</span>;
                    }
                    if (/^\/\//.test(part)) {
                      return <span key={j} className="text-muted-foreground">{part}</span>;
                    }
                    if (/^["']/.test(part)) {
                      return <span key={j} className="text-ipc-queue">{part}</span>;
                    }
                    if (/^\d+$/.test(part)) {
                      return <span key={j} className="text-accent">{part}</span>;
                    }
                    return <span key={j}>{part}</span>;
                  })}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
