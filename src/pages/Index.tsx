import Header from "@/components/Header";
import IPCSimulator from "@/components/IPCSimulator";
import SecurityPanel from "@/components/SecurityPanel";
import CodeBlock from "@/components/CodeBlock";
import { motion } from "framer-motion";

const ipcMethods = [
  {
    type: "pipe" as const,
    title: "Named Pipes (FIFOs)",
    description: "Unidirectional data flow between processes. Data is written to one end and read from the other in FIFO order.",
  },
  {
    type: "queue" as const,
    title: "Message Queues",
    description: "Processes communicate by sending and receiving messages. Messages can be prioritized and selectively retrieved.",
  },
  {
    type: "memory" as const,
    title: "Shared Memory",
    description: "Fastest IPC method. Multiple processes access a common memory segment for direct data exchange.",
  },
];

const codeExamples = {
  pipe: `#include <stdio.h>
#include <unistd.h>

int main() {
    int pipefd[2];
    char buffer[128];
    
    // Create pipe with security check
    if (pipe(pipefd) == -1) {
        perror("Pipe creation failed");
        return 1;
    }
    
    pid_t pid = fork();
    
    if (pid == 0) {
        // Child process (Reader)
        close(pipefd[1]);
        read(pipefd[0], buffer, 128);
        printf("Received: %s\\n", buffer);
        close(pipefd[0]);
    } else {
        // Parent process (Writer)
        close(pipefd[0]);
        write(pipefd[1], "Secure IPC Data", 16);
        close(pipefd[1]);
    }
    
    return 0;
}`,
  queue: `#include <sys/msg.h>
#include <stdio.h>

struct message {
    long mtype;
    char mtext[100];
};

int main() {
    key_t key = ftok("ipc_key", 65);
    int msgid = msgget(key, 0666 | IPC_CREAT);
    
    struct message msg;
    msg.mtype = 1;
    sprintf(msg.mtext, "Secure message data");
    
    // Send with authentication check
    if (validate_process_auth()) {
        msgsnd(msgid, &msg, sizeof(msg), 0);
        printf("Message sent successfully\\n");
    } else {
        printf("Access denied\\n");
    }
    
    return 0;
}`,
  memory: `#include <sys/shm.h>
#include <stdio.h>
#include <string.h>

int main() {
    key_t key = ftok("shmfile", 65);
    
    // Create shared segment with permissions
    int shmid = shmget(key, 1024, 0666 | IPC_CREAT);
    
    // Attach with security validation
    char *str = (char*) shmat(shmid, NULL, 0);
    
    if (has_write_permission()) {
        strcpy(str, "Encrypted shared data");
        printf("Data written to shared memory\\n");
    }
    
    // Detach from segment
    shmdt(str);
    
    return 0;
}`,
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Scanline Effect */}
      <div className="scanline" />
      
      <Header />

      <main className="container pb-16">
        {/* IPC Methods Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              IPC Mechanisms
            </h2>
            <p className="text-muted-foreground">
              Interactive simulations of different inter-process communication methods
            </p>
          </motion.div>

          <div className="grid gap-8">
            {ipcMethods.map((method, index) => (
              <motion.div
                key={method.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.2 }}
              >
                <IPCSimulator
                  type={method.type}
                  title={method.title}
                  description={method.description}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Security Features
            </h2>
            <p className="text-muted-foreground">
              Multi-layer protection preventing unauthorized data access
            </p>
          </motion.div>

          <SecurityPanel />
        </section>

        {/* Code Examples Section */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Implementation Examples
            </h2>
            <p className="text-muted-foreground">
              C code snippets demonstrating secure IPC implementations
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <CodeBlock
              title="pipe_example.c"
              language="c"
              code={codeExamples.pipe}
            />
            <CodeBlock
              title="message_queue.c"
              language="c"
              code={codeExamples.queue}
            />
            <CodeBlock
              title="shared_memory.c"
              language="c"
              code={codeExamples.memory}
            />
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 pt-8 border-t border-border text-center"
        >
          <p className="text-muted-foreground text-sm font-mono">
            Operating Systems • Inter-Process Communication Framework
          </p>
          <p className="text-muted-foreground/60 text-xs mt-2">
            Demonstrating pipes, message queues, shared memory & security
          </p>
        </motion.footer>
      </main>
    </div>
  );
};

export default Index;
