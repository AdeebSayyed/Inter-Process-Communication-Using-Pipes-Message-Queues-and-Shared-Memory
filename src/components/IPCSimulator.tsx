import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProcessNode from "./ProcessNode";
import DataFlow from "./DataFlow";
import { Play, Pause, RotateCcw, Shield, ShieldOff } from "lucide-react";
import { Button } from "./ui/button";

interface IPCSimulatorProps {
  type: "pipe" | "queue" | "memory";
  title: string;
  description: string;
}

const IPCSimulator = ({ type, title, description }: IPCSimulatorProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        const timestamp = new Date().toLocaleTimeString();
        const action = isSecure
          ? `[${timestamp}] Data packet transferred successfully via ${type}`
          : `[${timestamp}] ACCESS DENIED - Unauthorized process blocked`;
        setLogs((prev) => [...prev.slice(-4), action]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRunning, isSecure, type]);

  const handleReset = () => {
    setIsRunning(false);
    setLogs([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-window"
    >
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-dot bg-destructive" />
        <div className="terminal-dot bg-accent" />
        <div className="terminal-dot bg-secondary" />
        <span className="ml-3 text-sm text-muted-foreground font-mono">
          {title.toLowerCase().replace(/\s/g, "_")}.ipc
        </span>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className={`
            font-display text-xl font-bold mb-2
            ${type === "pipe" ? "text-gradient-pipe" : ""}
            ${type === "queue" ? "text-gradient-queue" : ""}
            ${type === "memory" ? "text-gradient-memory" : ""}
          `}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Visualization */}
        <div className="flex items-center justify-between mb-6 py-8">
          <ProcessNode
            id="1024"
            name="Sender"
            isSecure={isSecure}
            isActive={isRunning}
            variant="sender"
          />
          
          <DataFlow type={type} isActive={isRunning} isSecure={isSecure} />
          
          <ProcessNode
            id="2048"
            name="Receiver"
            isSecure={isSecure}
            isActive={isRunning}
            variant="receiver"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={`
              ${isRunning 
                ? "bg-destructive hover:bg-destructive/90" 
                : "bg-primary hover:bg-primary/90"
              } text-primary-foreground
            `}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsSecure(!isSecure)}
            className={`
              border-2
              ${isSecure 
                ? "border-secondary text-secondary hover:bg-secondary/10" 
                : "border-destructive text-destructive hover:bg-destructive/10"
              }
            `}
          >
            {isSecure ? (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Security ON
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4 mr-2" />
                Security OFF
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Log Console */}
        <div className="bg-background/50 rounded-lg p-4 border border-border min-h-[100px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">$ system.log</span>
            <span className="w-2 h-4 bg-primary animate-blink" />
          </div>
          <AnimatePresence mode="popLayout">
            {logs.map((log, i) => (
              <motion.p
                key={`${log}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`text-xs font-mono ${
                  log.includes("DENIED") ? "text-destructive" : "text-secondary"
                }`}
              >
                {log}
              </motion.p>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <p className="text-xs text-muted-foreground">
              Waiting for simulation to start...
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default IPCSimulator;
