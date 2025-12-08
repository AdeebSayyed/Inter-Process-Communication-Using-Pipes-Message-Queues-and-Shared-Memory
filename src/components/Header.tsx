import { motion } from "framer-motion";
import { Network, Cpu, Database } from "lucide-react";

const Header = () => {
  return (
    <header className="relative py-16 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Icon Group */}
          <div className="flex justify-center gap-4 mb-6">
            {[Cpu, Network, Database].map((Icon, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                className={`
                  p-4 rounded-xl border-2
                  ${i === 0 ? "border-ipc-pipe bg-ipc-pipe/10 glow-pipe" : ""}
                  ${i === 1 ? "border-ipc-queue bg-ipc-queue/10 glow-queue" : ""}
                  ${i === 2 ? "border-ipc-memory bg-ipc-memory/10 glow-memory" : ""}
                `}
              >
                <Icon className={`w-8 h-8 ${
                  i === 0 ? "text-ipc-pipe" :
                  i === 1 ? "text-ipc-queue" :
                  "text-ipc-memory"
                }`} />
              </motion.div>
            ))}
          </div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-6xl font-bold mb-4"
          >
            <span className="text-foreground">Inter-Process</span>
            <br />
            <span className="text-gradient-pipe">Communication</span>
            <span className="text-foreground"> Framework</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            A comprehensive visualization of IPC mechanisms including pipes, 
            message queues, and shared memory with security features.
          </motion.p>

          {/* OS Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm text-muted-foreground font-mono">
              Operating Systems Project
            </span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
