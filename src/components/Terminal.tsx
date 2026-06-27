import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error';
}

export default function Terminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'Microsoft Windows [Version 10.0.19045]', type: 'output' },
    { text: '(c) Microsoft Corporation. All rights reserved.', type: 'output' },
    { text: '', type: 'output' },
    { text: 'Type "help" for a list of available commands.', type: 'output' },
    { text: '', type: 'output' },
  ]);
  const [input, setInput] = useState('');
  const terminalScrollRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTo({
        top: terminalScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { text: `C:\\Users\\Garvik>${cmd}`, type: 'input' as const }];

    if (trimmedCmd === '') {
      setHistory(newHistory);
      return;
    }

    switch (trimmedCmd) {
      case 'help':
        newHistory.push(
          { text: 'Available commands:', type: 'output' },
          { text: '  whoami    - Display basic info about Garvik', type: 'output' },
          { text: '  focus     - Current research & development focus', type: 'output' },
          { text: '  skills    - View technical skill set summary', type: 'output' },
          { text: '  contact   - Display contact details', type: 'output' },
          { text: '  clear     - Clear the terminal screen', type: 'output' }
        );
        break;
      case 'whoami':
        newHistory.push({
          text: 'Garvik Jain | AI & ML Engineer & Full-Stack Developer. B.Tech CSE (AI & ML) at VIT Chennai. Rank 1 in Cohort (CGPA 9.92/10.0).',
          type: 'output',
        });
        break;
      case 'focus':
        newHistory.push({
          text: "Lately, I've been diving deep into advanced AI architectures and exploring how intelligent systems can retrieve knowledge and perform meaningfully in the real world.",
          type: 'output',
        });
        break;
      case 'skills':
        newHistory.push(
          { text: 'Languages: Python, Java, C++, SQL, TypeScript, JavaScript', type: 'output' },
          { text: 'AI/ML: PyTorch, TensorFlow, Scikit-learn, LangChain, NetworkX, ChromaDB, Ollama', type: 'output' },
          { text: 'Web & Ops: React.js, Flask, Node.js, FastAPI, REST APIs, Docker, Git', type: 'output' }
        );
        break;
      case 'contact':
        newHistory.push(
          { text: 'Email: garvikjain6@gmail.com', type: 'output' },
          { text: 'Phone: +91 6366361612', type: 'output' },
          { text: 'GitHub: github.com/GarvikJain', type: 'output' },
          { text: 'LinkedIn: linkedin.com/in/garvik-jain-23378931b', type: 'output' }
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHistory.push({
          text: `'${cmd}' is not recognized as an internal or external command, operable program or batch file. Type "help" for assistance.`,
          type: 'error',
        });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-black text-[#00ff00] font-mono text-sm p-4 rounded-xl border-2 border-black overflow-hidden shadow-inner">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-[#00ff00]/30 pb-2 mb-2 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="text-[#00ff00]/60 text-xs font-semibold ml-2">MS-DOS Prompt - cmd.exe</span>
        </div>
        <div className="text-[#00ff00]/40 text-xs">80x25</div>
      </div>

      {/* Terminal Output */}
      <div ref={terminalScrollRef} className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar scroll-smooth">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`whitespace-pre-wrap ${
              line.type === 'input'
                ? 'text-white'
                : line.type === 'error'
                ? 'text-red-400 font-semibold'
                : 'text-[#00ff00]'
            }`}
          >
            {line.text}
          </div>
        ))}
        {/* Active Input Line */}
        <div className="flex items-center text-white">
          <span className="text-[#00ff00] shrink-0">C:\Users\Garvik&gt;</span>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm ml-1 p-0 focus:ring-0 focus:border-none focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal command input"
          />
        </div>
      </div>
    </div>
  );
}
