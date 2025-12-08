import { motion } from "framer-motion";

interface DataFlowProps {
  type: "pipe" | "queue" | "memory";
  isActive: boolean;
  isSecure: boolean;
}

const DataFlow = ({ type, isActive, isSecure }: DataFlowProps) => {
  const colors = {
    pipe: {
      bg: "bg-ipc-pipe/20",
      border: "border-ipc-pipe",
      glow: "glow-pipe",
      packet: "bg-ipc-pipe",
    },
    queue: {
      bg: "bg-ipc-queue/20",
      border: "border-ipc-queue",
      glow: "glow-queue",
      packet: "bg-ipc-queue",
    },
    memory: {
      bg: "bg-ipc-memory/20",
      border: "border-ipc-memory",
      glow: "glow-memory",
      packet: "bg-ipc-memory",
    },
  };

  const style = colors[type];

  return (
    <div className="relative flex-1 mx-4 h-16 flex items-center">
      {/* Connection Line */}
      <div className={`
        absolute inset-x-0 h-1 rounded-full
        ${style.bg} border ${style.border}
        ${isActive ? style.glow : ""}
      `} />

      {/* Data Packets */}
      {isActive && isSecure && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`absolute w-4 h-4 rounded-full ${style.packet}`}
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: ["0%", "100%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ left: 0 }}
            />
          ))}
        </>
      )}

      {/* Security Block Indicator */}
      {isActive && !isSecure && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-destructive text-destructive-foreground text-xs font-medium"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          ACCESS DENIED
        </motion.div>
      )}

      {/* Type Label */}
      <div className={`
        absolute left-1/2 -translate-x-1/2 -top-6
        px-3 py-1 rounded text-xs font-mono uppercase tracking-wider
        ${style.bg} ${style.border} border
      `}>
        {type === "pipe" && "Named Pipe"}
        {type === "queue" && "Message Queue"}
        {type === "memory" && "Shared Memory"}
      </div>
    </div>
  );
};

export default DataFlow;
