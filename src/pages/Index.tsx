import { useState } from "react";
import { Play, Pause, Shield, ShieldOff, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ipcMethods = [
  {
    type: "pipe",
    title: "Pipes",
    description: "Unidirectional data flow between processes in FIFO order.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  {
    type: "queue",
    title: "Message Queues",
    description: "Processes send and receive prioritized messages.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/30",
  },
  {
    type: "memory",
    title: "Shared Memory",
    description: "Fastest IPC - direct access to common memory segment.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
];

const codeExamples = {
  pipe: `// Pipe Example
int pipefd[2];
pipe(pipefd);

if (fork() == 0) {
    // Child reads
    close(pipefd[1]);
    read(pipefd[0], buffer, 128);
} else {
    // Parent writes
    close(pipefd[0]);
    write(pipefd[1], "Hello", 6);
}`,
  queue: `// Message Queue Example
struct message { long type; char text[100]; };

key_t key = ftok("file", 65);
int msgid = msgget(key, 0666 | IPC_CREAT);

msg.type = 1;
strcpy(msg.text, "Hello");
msgsnd(msgid, &msg, sizeof(msg), 0);`,
  memory: `// Shared Memory Example
key_t key = ftok("file", 65);
int shmid = shmget(key, 1024, 0666 | IPC_CREAT);

char *str = (char*) shmat(shmid, NULL, 0);
strcpy(str, "Hello from shared memory");
shmdt(str);`,
};

const securityFeatures = [
  { name: "Access Control", status: "Active" },
  { name: "Encryption", status: "AES-256" },
  { name: "Authentication", status: "Enabled" },
  { name: "Intrusion Detection", status: "Monitoring" },
];

// Simple IPC Demo Component
const IPCDemo = ({ method }: { method: typeof ipcMethods[0] }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  const toggleSimulation = () => {
    if (!isRunning) {
      setLogs((prev) => [
        ...prev.slice(-3),
        isSecure
          ? `[OK] Data transferred via ${method.type}`
          : `[BLOCKED] Unauthorized access denied`,
      ]);
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className={`p-6 rounded-lg border ${method.borderColor} ${method.bgColor}`}>
      <h3 className={`text-xl font-bold mb-2 ${method.color}`}>{method.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{method.description}</p>

      {/* Simple visualization */}
      <div className="flex items-center justify-center gap-4 py-6 mb-4">
        <div className="px-4 py-2 bg-muted rounded text-sm">Process A</div>
        <div className={`flex-1 h-1 ${isRunning ? "bg-primary" : "bg-border"} rounded transition-colors`} />
        <div className="px-4 py-2 bg-muted rounded text-sm">Process B</div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <Button size="sm" onClick={toggleSimulation} variant={isRunning ? "destructive" : "default"}>
          {isRunning ? <><Pause className="w-4 h-4 mr-1" /> Stop</> : <><Play className="w-4 h-4 mr-1" /> Start</>}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsSecure(!isSecure)}>
          {isSecure ? <><Shield className="w-4 h-4 mr-1" /> Secure</> : <><ShieldOff className="w-4 h-4 mr-1" /> Insecure</>}
        </Button>
      </div>

      {/* Logs */}
      <div className="bg-background/50 p-3 rounded text-xs font-mono min-h-[60px]">
        {logs.length === 0 ? (
          <span className="text-muted-foreground">Click Start to simulate...</span>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={log.includes("BLOCKED") ? "text-destructive" : "text-secondary"}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Simple Code Block
const CodeExample = ({ title, code }: { title: string; code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Button size="sm" variant="ghost" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="text-foreground/80">{code}</code>
      </pre>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-8">
        <div className="container text-center">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-full mb-4">
            Operating Systems Project
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Inter-Process Communication Framework
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Pipes, Message Queues, and Shared Memory with security features
          </p>
        </div>
      </header>

      <main className="container py-12 space-y-16">
        {/* IPC Methods */}
        <section>
          <h2 className="text-2xl font-bold mb-6">IPC Mechanisms</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ipcMethods.map((method) => (
              <IPCDemo key={method.type} method={method} />
            ))}
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Security Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {securityFeatures.map((feature) => (
              <div key={feature.name} className="p-4 bg-card rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">{feature.name}</p>
                <p className="text-lg font-semibold text-secondary">{feature.status}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Code Examples (C)</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            <CodeExample title="pipe_example.c" code={codeExamples.pipe} />
            <CodeExample title="message_queue.c" code={codeExamples.queue} />
            <CodeExample title="shared_memory.c" code={codeExamples.memory} />
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          Operating Systems • IPC Framework
        </footer>
      </main>
    </div>
  );
};

export default Index;
