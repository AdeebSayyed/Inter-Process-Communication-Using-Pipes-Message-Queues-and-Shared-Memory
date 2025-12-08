import { motion } from "framer-motion";
import { Cpu, Lock, Unlock } from "lucide-react";

interface ProcessNodeProps {
  id: string;
  name: string;
  isSecure: boolean;
  isActive: boolean;
  variant: "sender" | "receiver";
}

const ProcessNode = ({ id, name, isSecure, isActive, variant }: ProcessNodeProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`
        relative p-6 rounded-xl border-2 min-w-[160px]
        ${isActive ? "border-primary glow-pipe" : "border-border"}
        bg-card/80 backdrop-blur-sm
      `}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={`
          p-3 rounded-lg 
          ${variant === "sender" ? "bg-primary/20" : "bg-secondary/20"}
        `}>
          <Cpu className={`w-8 h-8 ${variant === "sender" ? "text-primary" : "text-secondary"}`} />
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">PID: {id}</p>
          <h3 className="font-display font-semibold text-foreground">{name}</h3>
        </div>

        <div className={`
          flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
          ${isSecure 
            ? "bg-secondary/20 text-secondary" 
            : "bg-destructive/20 text-destructive"
          }
        `}>
          {isSecure ? (
            <>
              <Lock className="w-3 h-3" />
              <span>Authorized</span>
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3" />
              <span>Unauthorized</span>
            </>
          )}
        </div>
      </div>

      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default ProcessNode;
