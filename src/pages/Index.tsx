import { useState } from "react";
import { Play, Pause, Shield, ShieldOff, Copy, Check, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ipcMethods = [
  {
    type: "pipe",
    title: "Pipes",
    description: "Unidirectional data channel - data flows from writer to reader in FIFO order.",
    colorClass: "ipc-pipe",
  },
  {
    type: "queue",
    title: "Message Queues",
    description: "Prioritized message passing - processes send and receive typed messages.",
    colorClass: "ipc-queue",
  },
  {
    type: "memory",
    title: "Shared Memory",
    description: "Direct memory access - fastest IPC method for large data transfers.",
    colorClass: "ipc-memory",
  },
];

const codeExamples = {
  pipe: `#include <unistd.h>
#include <stdio.h>

int main() {
    int fd[2];
    char buffer[128];
    
    pipe(fd);  // Create pipe
    
    if (fork() == 0) {
        close(fd[1]);  // Child closes write end
        read(fd[0], buffer, sizeof(buffer));
        printf("Received: %s\\n", buffer);
    } else {
        close(fd[0]);  // Parent closes read end
        write(fd[1], "Hello from parent!", 18);
    }
    return 0;
}`,
  queue: `#include <sys/msg.h>
#include <string.h>

struct msg_buffer {
    long msg_type;
    char msg_text[100];
};

int main() {
    key_t key = ftok("progfile", 65);
    int msgid = msgget(key, 0666 | IPC_CREAT);
    
    struct msg_buffer message;
    message.msg_type = 1;
    strcpy(message.msg_text, "Hello via queue!");
    
    msgsnd(msgid, &message, sizeof(message), 0);
    return 0;
}`,
  memory: `#include <sys/shm.h>
#include <string.h>

int main() {
    key_t key = ftok("shmfile", 65);
    int shmid = shmget(key, 1024, 0666 | IPC_CREAT);
    
    char *str = (char*) shmat(shmid, NULL, 0);
    strcpy(str, "Shared memory data");
    
    printf("Written: %s\\n", str);
    shmdt(str);
    return 0;
}`,
};

const securityFeatures = [
  { name: "Access Control Lists", desc: "Process-level permissions" },
  { name: "Data Encryption", desc: "AES-256 in transit" },
  { name: "Process Auth", desc: "PID verification" },
  { name: "Audit Logging", desc: "All transfers logged" },
];

// Process visualization component
const ProcessBox = ({ label, isActive }: { label: string; isActive: boolean }) => (
  <div className={`
    flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300
    ${isActive ? "bg-primary/20 border-primary shadow-glow" : "bg-muted/50 border-border"}
  `}>
    <Cpu className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

// Data flow animation
const DataFlow = ({ isActive, isSecure }: { isActive: boolean; isSecure: boolean }) => (
  <div className="flex-1 flex items-center justify-center px-4">
    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
      {isActive && (
        <div className={`
          absolute inset-y-0 left-0 w-1/3 rounded-full
          ${isSecure ? "bg-primary" : "bg-destructive"}
          animate-flow
        `} />
      )}
    </div>
    <ArrowRight className={`w-5 h-5 ml-2 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
  </div>
);

// IPC Simulator Card
const IPCCard = ({ method }: { method: typeof ipcMethods[0] }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [log, setLog] = useState<string | null>(null);

  const handleToggle = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setLog(isSecure 
        ? `✓ Data transferred via ${method.type}` 
        : `✗ Access blocked - unauthorized`
      );
    }
  };

  return (
    <div className={`ipc-card ${method.colorClass}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">{method.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
        </div>
      </div>

      {/* Process Visualization */}
      <div className="flex items-center gap-2 py-6">
        <ProcessBox label="Process A" isActive={isRunning} />
        <DataFlow isActive={isRunning} isSecure={isSecure} />
        <ProcessBox label="Process B" isActive={isRunning} />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button 
          size="sm" 
          onClick={handleToggle}
          className={isRunning ? "bg-destructive hover:bg-destructive/90" : ""}
        >
          {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          {isRunning ? "Stop" : "Start"}
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => setIsSecure(!isSecure)}
          className={isSecure ? "border-secondary text-secondary" : "border-destructive text-destructive"}
        >
          {isSecure ? <Shield className="w-4 h-4 mr-1" /> : <ShieldOff className="w-4 h-4 mr-1" />}
          {isSecure ? "Secure" : "Insecure"}
        </Button>
      </div>

      {/* Log output */}
      {log && (
        <div className={`mt-4 px-3 py-2 rounded text-sm font-mono ${
          log.includes("✓") ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
        }`}>
          {log}
        </div>
      )}
    </div>
  );
};

// Code Block with copy
const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button 
        size="sm" 
        variant="ghost" 
        className="absolute top-2 right-2 h-8 w-8 p-0"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4 text-secondary" /> : <Copy className="w-4 h-4" />}
      </Button>
      <pre className="p-4 bg-background rounded-lg text-sm overflow-x-auto">
        <code className="text-foreground/90">{code}</code>
      </pre>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-10 text-center">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
            Operating Systems Project
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Inter-Process Communication Framework
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Explore how processes communicate using pipes, message queues, and shared memory — with built-in security.
          </p>
        </div>
      </header>

      <main className="container py-12 space-y-16">
        {/* IPC Methods */}
        <section>
          <h2 className="section-title">IPC Mechanisms</h2>
          <p className="section-desc">Click Start to simulate data transfer between processes</p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {ipcMethods.map((method) => (
              <IPCCard key={method.type} method={method} />
            ))}
          </div>
        </section>

        {/* Security Features */}
        <section>
          <h2 className="section-title">Security Features</h2>
          <p className="section-desc">Multi-layer protection for inter-process communication</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {securityFeatures.map((feature) => (
              <div key={feature.name} className="p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
                <Shield className="w-5 h-5 text-primary mb-2" />
                <h4 className="font-medium text-sm">{feature.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code Examples with Tabs */}
        <section>
          <h2 className="section-title">Implementation (C)</h2>
          <p className="section-desc">Ready-to-use code examples for each IPC method</p>
          <Tabs defaultValue="pipe" className="mt-6">
            <TabsList className="w-full justify-start bg-muted/50 p-1">
              <TabsTrigger value="pipe" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Pipes
              </TabsTrigger>
              <TabsTrigger value="queue" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                Message Queue
              </TabsTrigger>
              <TabsTrigger value="memory" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                Shared Memory
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pipe" className="mt-4">
              <CodeBlock code={codeExamples.pipe} />
            </TabsContent>
            <TabsContent value="queue" className="mt-4">
              <CodeBlock code={codeExamples.queue} />
            </TabsContent>
            <TabsContent value="memory" className="mt-4">
              <CodeBlock code={codeExamples.memory} />
            </TabsContent>
          </Tabs>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Operating Systems • Inter-Process Communication Framework
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
