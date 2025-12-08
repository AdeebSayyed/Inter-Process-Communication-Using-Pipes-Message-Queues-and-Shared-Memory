import { motion } from "framer-motion";
import { Shield, Key, Lock, AlertTriangle, CheckCircle } from "lucide-react";

const securityFeatures = [
  {
    icon: Key,
    title: "Access Control Lists (ACL)",
    description: "Define read/write permissions for each process based on user credentials and process IDs.",
    status: "active",
  },
  {
    icon: Lock,
    title: "Encryption at Rest",
    description: "All shared memory segments and message queues use AES-256 encryption for data protection.",
    status: "active",
  },
  {
    icon: Shield,
    title: "Process Authentication",
    description: "Mutual authentication between communicating processes using digital signatures.",
    status: "active",
  },
  {
    icon: AlertTriangle,
    title: "Intrusion Detection",
    description: "Real-time monitoring for unauthorized access attempts with automatic blocking.",
    status: "monitoring",
  },
];

const SecurityPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-window"
    >
      <div className="terminal-header">
        <div className="terminal-dot bg-destructive" />
        <div className="terminal-dot bg-accent" />
        <div className="terminal-dot bg-secondary" />
        <span className="ml-3 text-sm text-muted-foreground font-mono">
          security_manager.sys
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-ipc-security/20">
            <Shield className="w-8 h-8 text-ipc-security" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Security Framework
            </h3>
            <p className="text-sm text-muted-foreground">
              Multi-layer protection for IPC channels
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-ipc-security/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-ipc-security/20">
                <feature.icon className="w-5 h-5 text-ipc-security" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">{feature.title}</h4>
                  <span className={`
                    flex items-center gap-1 text-xs px-2 py-1 rounded-full
                    ${feature.status === "active" 
                      ? "bg-secondary/20 text-secondary" 
                      : "bg-accent/20 text-accent"
                    }
                  `}>
                    {feature.status === "active" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {feature.status === "active" ? "Active" : "Monitoring"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: "Blocked Attempts", value: "0", color: "text-destructive" },
            { label: "Active Channels", value: "3", color: "text-primary" },
            { label: "Encryption", value: "AES-256", color: "text-secondary" },
          ].map((metric) => (
            <div key={metric.label} className="text-center p-4 rounded-lg bg-background/50 border border-border">
              <p className={`text-2xl font-bold font-mono ${metric.color}`}>
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityPanel;
