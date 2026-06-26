import { useState, useEffect } from 'react';
import { 
  Mail, 
  MapPin, 
  Award, 
  Menu, 
  X, 
  Check, 
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import Terminal from './components/Terminal';
import DevStack from './components/DevStack';
import ProjectGrid from './components/ProjectGrid';
import Languages from './components/Languages';
import FallingStars from './components/FallingStars';

// Inline SVGs to avoid missing package icons in certain environments
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDayMode, setIsDayMode] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({ name: false, email: false, message: false });

  // Loading Preloader State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Manual Scroll Restoration & Boot Logic
  useEffect(() => {
    // Override default browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Increment progress to 100% over ~1.5s
    const startTime = Date.now();
    const duration = 1350; // 1350ms loading progress + 150ms final delay = 1500ms (1.5s)
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      
      setLoadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          window.scrollTo(0, 0);
        }, 150);
      }
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const getBootLogs = (progress: number) => {
    const logs = [
      'GarvikOS(R) BIOS v1.0.0 (C) 2026 Garvik Corp.',
      'CPU: AI-ML Quantum Engine @ 9.92 GHz',
      'RAM: 16.0 GB (VIT CHENNAI MERIT CORE)',
      '--------------------------------------------------',
    ];

    if (progress >= 10) logs.push('STATUS: Checking file systems... OK');
    if (progress >= 25) logs.push('STATUS: Loading languages.dll (Hindi/English/Kannada/French)... OK');
    if (progress >= 45) logs.push('STATUS: Initializing RAG engine (rag_engine.sys)... OK');
    if (progress >= 65) logs.push('STATUS: Mounting projects database (projects.dat)... OK');
    if (progress >= 80) logs.push('STATUS: Establishing secure email port... OK');
    if (progress >= 95) logs.push('STATUS: Launching portfolio shell UI... OK');
    if (progress >= 100) logs.push('BOOT SUCCESSFUL. PRESS ENTER TO ACCESS.');

    return logs;
  };

  const getProgressBar = (progress: number) => {
    const totalBars = 20;
    const filledBars = Math.round((progress / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    return `[${'█'.repeat(filledBars)}${'░'.repeat(emptyBars)}] ${progress}%`;
  };


  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      name: contactForm.name.trim() === '',
      email: !/\S+@\S+\.\S+/.test(contactForm.email),
      message: contactForm.message.trim() === '',
    };

    setFormErrors(errors);

    if (!errors.name && !errors.email && !errors.message) {
      setToastMessage('System: Sending message via secure port...');

      fetch("https://formsubmit.co/ajax/garvikjain6@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Name: contactForm.name,
          Email: contactForm.email,
          Message: contactForm.message,
          _subject: `New Portfolio Message from ${contactForm.name}`
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success === "true" || data.success === true) {
          setToastMessage('System: Message sent successfully! response_code: 200');
        } else {
          setToastMessage('System Error: Mail transport failed. code: 500');
        }
      })
      .catch(() => {
        setToastMessage('System Error: Mail transport failed. code: 500');
      });

      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className={`min-h-screen relative font-body overflow-x-hidden p-3 md:p-6 grid-overlay transition-all duration-500 ${
      isLoading ? 'h-screen overflow-hidden' : ''
    } ${
      isDayMode ? 'bg-day-gradient text-black' : 'bg-night-gradient text-white'
    }`}>
      {/* Startup BIOS Preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-[#0a0a0c] text-[#00ff00] font-mono z-[100] flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none"
          >
            {/* Scanlines / CRT Overlay */}
            <div className="absolute inset-0 noise-overlay pointer-events-none opacity-10" />
            <div className="absolute inset-0 scanline-overlay pointer-events-none" />

            <div className="space-y-4 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-start">
              {/* Retro Logo or Brand */}
              <div className="flex items-center space-x-3 text-white border-b-2 border-[#00ff00]/30 pb-4 mb-4">
                <span className="text-xl font-bold tracking-widest text-[#00ff00] uppercase">
                  GarvikOS Boot Loader
                </span>
                <span className="text-xs bg-[#00ff00] text-black px-1.5 py-0.5 rounded font-black font-mono">
                  v1.0.0
                </span>
              </div>

              {/* Console Logs */}
              <div className="space-y-2 text-xs md:text-sm font-semibold leading-relaxed flex-1 overflow-y-auto">
                {getBootLogs(loadingProgress).map((log, index) => (
                  <div key={index} className="flex items-center space-x-1.5">
                    {index >= 4 && index < 10 && <span className="text-white">&gt;</span>}
                    <span className={log.includes('SUCCESSFUL') ? 'text-white font-black animate-pulse' : ''}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Progress Bar area */}
            <div className="max-w-2xl mx-auto w-full pt-4 border-t-2 border-[#00ff00]/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs md:text-sm">
                <div className="font-bold tracking-wider text-[#00ff00]">
                  {getProgressBar(loadingProgress)}
                </div>
                <div className="text-[#00ff00]/60 uppercase tracking-widest font-bold">
                  {loadingProgress < 100 ? 'System Booting...' : 'Ready to Launch'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FallingStars isDayMode={isDayMode} />
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        
        {/* Windows 98 Menu Bar Navbar */}
        <header className="sticky top-0 z-40 bg-[#FBFAF5] text-black border-[3px] border-black rounded-xl shadow-neo py-2 px-4 flex items-center justify-between font-mono font-bold">
          <div className="flex items-center space-x-2 flex-1">
            <Compass className="w-5 h-5 text-brand-blue" />
            <span className="text-sm tracking-tight hover:underline cursor-pointer" onClick={() => scrollToSection('home')}>
              GarvikOS_v1.0.exe
            </span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6 text-xs select-none">
            <button onClick={() => scrollToSection('home')} className="win-menu-item px-2 py-0.5 rounded">F_ile</button>
            <button onClick={() => scrollToSection('projects')} className="win-menu-item px-2 py-0.5 rounded">P_rojects</button>
            <button onClick={() => scrollToSection('experience')} className="win-menu-item px-2 py-0.5 rounded">E_xperience</button>
            <button onClick={() => scrollToSection('skills')} className="win-menu-item px-2 py-0.5 rounded">S_kills</button>
            <button onClick={() => scrollToSection('contact')} className="win-menu-item px-2 py-0.5 rounded">C_ontact</button>
          </nav>

          {/* Theme Switcher Button */}
          <button
            onClick={() => setIsDayMode(!isDayMode)}
            className="win-menu-item px-3 py-1 border-2 border-black bg-neutral-200 hover:bg-[#000080] hover:text-white rounded text-xs cursor-pointer mr-3 ml-4"
          >
            {isDayMode ? '🌙 Night_Mode' : '☀ Day_Mode'}
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 border-2 border-black bg-neutral-200 hover:bg-neutral-300 rounded active:translate-y-[1px]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-[#FBFAF5] text-black border-[3px] border-black rounded-xl shadow-neo p-4 font-mono font-bold space-y-3 z-30 relative"
            >
              <button onClick={() => scrollToSection('home')} className="block w-full text-left py-1 px-2 hover:bg-[#000080] hover:text-white rounded">📁 File (Home)</button>
              <button onClick={() => scrollToSection('projects')} className="block w-full text-left py-1 px-2 hover:bg-[#000080] hover:text-white rounded">📁 Projects</button>
              <button onClick={() => scrollToSection('experience')} className="block w-full text-left py-1 px-2 hover:bg-[#000080] hover:text-white rounded">📁 Experience</button>
              <button onClick={() => scrollToSection('skills')} className="block w-full text-left py-1 px-2 hover:bg-[#000080] hover:text-white rounded">📁 Skills</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-1 px-2 hover:bg-[#000080] hover:text-white rounded">📁 Contact</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento Grid */}
        <main className="grid grid-cols-12 gap-6" id="home">

          {/* 1. Bio / Hero Card (Span: 12) */}
          <section className="col-span-12 bg-brand-cream text-black neo-card p-6 flex flex-col md:flex-row justify-between relative group overflow-hidden">
            {/* Sticker */}
            <div className="absolute top-4 right-4 bg-brand-orange text-white border-2 border-black font-mono text-[9px] font-black uppercase py-1 px-3 rounded shadow-neo-sm transform rotate-[15deg] select-none pointer-events-none hover:rotate-0 transition-transform">
              ⚡ AI & ML Cohort
            </div>

            <div className="flex-1 space-y-4 pr-0 md:pr-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-neutral-500 font-mono text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Bangalore, Karnataka</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-none mt-1">
                  Garvik Jain
                </h1>
                <p className="text-sm font-mono font-bold text-brand-purple">
                  &lt;AI & ML Engineer / Full-Stack Developer /&gt;
                </p>
              </div>

              <div className="text-sm text-neutral-700 leading-relaxed font-medium space-y-4">
                <p>
                  Hey there! I'm <strong>Garvik Jain</strong>, a passionate Computer Science student with a drive to build intelligent systems and full-stack products that solve real-world problems.
                </p>
                <p>
                  Currently pursuing a Bachelor of Technology in Computer Science and Engineering (AI & ML) from Vellore Institute of Technology, Chennai, with a CGPA of 9.92/10 and honored to have received the Meritorious Award for academic excellence along the way.
                </p>
                <p>
                  My core interests revolve around Artificial Intelligence, Machine Learning, Large Language Models, Retrieval-Augmented Generation (RAG), Data Science, and Software Development. There's something deeply exciting about how modern AI systems can reason, retrieve, and generate and I find myself constantly exploring new ways to make these systems smarter, more grounded, and more impactful.
                </p>
                <p>
                  On the engineering side, I enjoy turning ideas into real, working products, whether that's building AI-powered applications, designing clean backends, or crafting intuitive frontends. For me, great AI and great engineering always go hand in hand.
                </p>
                <p>
                  My projects reflect what I care about most i.e. creating technology that has a purpose. I don't just build to ship, I build to solve.
                </p>
                <p>
                  Beyond the classroom, I've taken on leadership roles as Associate Public Relations Officer at Rotaract Club and Code of Conduct Head at Y-SoC, these are the spaces where I've learned that technology is as much about people as it is about code. With a growing portfolio of projects and an ever-expanding curiosity, I'm always chasing the next challenge, whether that's diving into LLM architectures, designing cleaner data pipelines, or shipping something meaningful from scratch.
                </p>
                <p className="italic font-semibold text-brand-purple">
                  I'm still early in my journey, and honestly that's the best part.
                </p>
              </div>

              {/* Action Buttons & Socials */}
              <div className="flex flex-wrap gap-2 pt-2">
                <a 
                  href="mailto:garvikjain6@gmail.com" 
                  className="flex items-center px-4 py-2 bg-brand-blue text-white hover:bg-blue-700 border-2 border-black font-mono font-bold text-xs rounded-lg shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
                >
                  <Mail className="w-4 h-4 mr-2" /> Connect
                </a>
                <a 
                  href="https://github.com/GarvikJain" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center px-4 py-2 bg-white hover:bg-neutral-100 border-2 border-black text-black font-mono font-bold text-xs rounded-lg shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
                >
                  <GithubIcon className="w-4 h-4 mr-2" /> GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/garvik-jain-23378931b" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center px-4 py-2 bg-white hover:bg-neutral-100 border-2 border-black text-black font-mono font-bold text-xs rounded-lg shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px]"
                >
                  <LinkedinIcon className="w-4 h-4 mr-2" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Profile Avatar Card */}
            <div className="mt-6 md:mt-0 md:w-44 flex flex-col items-center justify-center space-y-2 shrink-0">
              <div className="bg-white border-[3px] border-black rounded-2xl p-1.5 shadow-neo-sm relative overflow-hidden w-36 h-36 flex items-center justify-center">
                <img 
                  src="/assets/garvik_profile.jpg" 
                  alt="Garvik Jain" 
                  className="w-full h-full object-cover rounded-xl border border-black/10"
                />
              </div>
              <div className="text-center font-mono text-[9px] font-bold text-neutral-500 uppercase">
                garvik_profile.jpg
              </div>
            </div>
          </section>

          {/* 3. Leadership Roles Card (Span: 4) */}
          <section className="col-span-12 md:col-span-4 bg-brand-cream text-black neo-card p-6 flex flex-col justify-between select-none">
            <span className="font-mono text-[10px] text-neutral-500 font-bold uppercase">
              📋 LEADERSHIP_ROLES.LOG
            </span>
            <div className="flex-1 flex flex-col justify-center space-y-3.5 py-4 font-mono">
              <div className="border-b border-black/10 pb-2">
                <div className="text-[10px] font-black text-brand-purple uppercase">Associate Public Relations Officer</div>
                <div className="text-xs font-bold text-neutral-700 mt-0.5">Rotaract Club</div>
              </div>
              <div className="border-b border-black/10 pb-2">
                <div className="text-[10px] font-black text-brand-orange uppercase">Code of Conduct Head</div>
                <div className="text-xs font-bold text-neutral-700 mt-0.5">Y-SoC</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-brand-blue uppercase">Club Member</div>
                <div className="text-xs font-bold text-neutral-700 mt-0.5">Artificial Intelligence Club, VIT Chennai</div>
              </div>
            </div>
            <p className="text-[10px] font-mono font-semibold text-neutral-400">
              Verified by corresponding campus boards.
            </p>
          </section>

          {/* 4. Education Card (Span: 8) */}
          <section className="col-span-12 md:col-span-8 bg-brand-yellow text-black neo-card p-6 flex flex-col md:flex-row justify-between items-center relative overflow-hidden select-none">
            <div className="flex-1 space-y-4 pr-0 md:pr-6">
              <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 rounded border border-white/20 inline-block mb-1 w-max">
                🏫 ACADEMICS & DEGREES
              </span>
              
              <div className="space-y-1">
                <h3 className="text-xl font-display font-black tracking-tight leading-tight">
                  Vellore Institute of Technology
                </h3>
                <p className="text-xs font-mono font-bold text-black/70">
                  B.Tech in Computer Science and Engineering (AI & ML) | Chennai Campus | Expected 2028
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-display font-black tracking-tight leading-tight">
                  Sri Chaitanya CBSE & PU College
                </h3>
                <p className="text-xs font-mono font-bold text-black/70">
                  Bangalore
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-display font-black tracking-tight leading-tight">
                  Christ International School
                </h3>
                <p className="text-xs font-mono font-bold text-black/70">
                  Bangalore
                </p>
              </div>
            </div>

            {/* Custom Pixel Art Computer Graphic */}
            <div className="mt-4 md:mt-0 w-36 h-36 bg-white/40 border-2 border-black rounded-xl p-2 shadow-neo-sm flex items-center justify-center shrink-0">
              <img 
                src="/assets/retro_computer.png" 
                alt="Pixel Computer" 
                className="w-28 h-28 object-contain"
                onError={(e) => {
                  // Fallback if public folder is not mounted
                  (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/pixel-art/svg?seed=computer";
                }}
              />
            </div>
          </section>

          {/* 5. Dev Stack Explorer Card (Span: 5) */}
          <section className="col-span-12 md:col-span-5 min-h-[300px]">
            <DevStack />
          </section>

          {/* 6. Terminal Card (Span: 7) */}
          <section className="col-span-12 md:col-span-7 min-h-[300px]">
            <Terminal />
          </section>

          {/* 7. Experience Card (Span: 4) */}
          <section className="col-span-12 md:col-span-4 bg-brand-cream text-black neo-card p-6 flex flex-col justify-between select-none" id="experience">
            <div>
              <span className="font-mono text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded border border-black/20">
                💼 EXPERIENCE.DAT
              </span>
              <h3 className="text-2xl font-display font-black tracking-tight leading-tight mt-3">
                ML Intern
              </h3>
              <p className="text-xs font-mono font-bold text-neutral-500">Cognifyz Technologies | Jan - Feb 2026</p>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed font-semibold my-4">
              Built end-to-end ML data pipelines. Tuned hyperparameter classification models on 10,000+ records, yielding up to 85% predictive accuracy scores.
            </p>

            <div className="flex flex-wrap gap-1">
              <span className="text-[9px] font-mono font-black border border-black bg-white px-1.5 py-0.5 rounded">Python</span>
              <span className="text-[9px] font-mono font-black border border-black bg-white px-1.5 py-0.5 rounded">Pandas</span>
              <span className="text-[9px] font-mono font-black border border-black bg-white px-1.5 py-0.5 rounded">Scikit-learn</span>
            </div>
          </section>

          {/* 8. AI Stack Card (Span: 8) */}
          <section className="col-span-12 md:col-span-8 bg-brand-orange text-white neo-card p-6 flex flex-col md:flex-row justify-between items-center relative overflow-hidden select-none" id="skills">
            <div className="flex-1 space-y-4 pr-0 md:pr-6">
              <div>
                <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 rounded border border-white/20">
                  🧠 INTELLIGENCE_STACK.SYS
                </span>
                <h3 className="text-3xl font-display font-black tracking-tight leading-none mt-3 text-white">
                  AI & ML Engineering
                </h3>
                <p className="text-xs font-mono font-bold text-white/80 mt-1">Core modeling, retrieval, and workflows</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['Python', 'Tensorflow', 'Torch (PyTorch)', 'OpenCV', 'Scikit-learn', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Image Processing', 'Optimization', 'PostgreSQL', 'Matlab', 'R'].map((tech) => (
                  <span 
                    key={tech} 
                    className="text-xs font-mono font-bold border-2 border-black bg-white text-black px-2.5 py-0.75 rounded-lg shadow-neo-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Custom Pixel Art Brain Graphic */}
            <div className="mt-4 md:mt-0 w-36 h-36 bg-black/35 border-2 border-black rounded-xl p-2 shadow-neo-sm flex items-center justify-center shrink-0">
              <img 
                src="/assets/retro_brain.png" 
                alt="Pixel Brain" 
                className="w-28 h-28 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/pixel-art/svg?seed=brain";
                }}
              />
            </div>
          </section>

          {/* 10. Key Projects Showcase (Span: 12) */}
          <section className="col-span-12" id="projects">
            <ProjectGrid />
          </section>

          {/* 11. Languages Card (Span: 4) */}
          <section className="col-span-12 md:col-span-4 flex flex-col justify-stretch">
            <Languages />
          </section>

          {/* 12. Certifications Card (Span: 8) */}
          <section className="col-span-12 md:col-span-8 bg-[#D633FF] text-white neo-card p-6 flex flex-col justify-between select-none">
            <div>
              <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 rounded border border-white/20">
                🏆 CERTIFICATES.DAT
              </span>
              <h3 className="text-3xl font-display font-black tracking-tight leading-none mt-3 text-white">
                Certifications & Awards
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              {/* 1. Meritorious Award */}
              <div className="bg-white text-black border-2 border-black p-3 rounded-lg shadow-neo-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-brand-yellow shrink-0" />
                    <span className="font-mono text-xs font-bold">Meritorious Award</span>
                  </div>
                  <div className="text-[9px] font-bold text-neutral-400 font-mono mt-0.5 ml-7">Rank - 1 | VIT Chennai</div>
                  <p className="text-[10px] text-neutral-600 font-semibold mt-1">
                    Honored with academic excellence award for achieving 9.92 CGPA and Rank #1 in CSE AI & ML.
                  </p>
                </div>
              </div>

              {/* 2. Google AI Essentials */}
              <div className="bg-white text-black border-2 border-black p-3 rounded-lg shadow-neo-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="font-mono text-xs font-bold">Google AI Essentials Cert.</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 font-semibold mt-1">
                    Validated baseline prompt tuning, API integration, and AI safety ethics.
                  </p>
                </div>
              </div>

              {/* 3. NPTEL Public Speaking */}
              <div className="bg-white text-black border-2 border-black p-3 rounded-lg shadow-neo-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-brand-teal shrink-0" />
                    <span className="font-mono text-xs font-bold">NPTEL Public Speaking</span>
                  </div>
                  <div className="text-[9px] font-bold text-neutral-400 font-mono mt-0.5 ml-7">IIT Roorkee (Top 1%)</div>
                  <p className="text-[10px] text-neutral-600 font-semibold mt-1">
                    Achieved elite top 1% rank in formal communication, public speaking, and debate validation.
                  </p>
                </div>
              </div>

              {/* 4. Conservation Economics */}
              <div className="bg-white text-black border-2 border-black p-3 rounded-lg shadow-neo-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-brand-purple shrink-0" />
                    <span className="font-mono text-xs font-bold">Conservation Economics</span>
                  </div>
                  <div className="text-[9px] font-bold text-neutral-400 font-mono mt-0.5 ml-7">IIT Kanpur</div>
                  <p className="text-[10px] text-neutral-600 font-semibold mt-1">
                    Evaluated ecological resources pricing models, sustainability policies, and resource mechanics.
                  </p>
                </div>
              </div>

              {/* 5. Dataset Hackathon */}
              <div className="bg-white text-black border-2 border-black p-3 rounded-lg shadow-neo-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-brand-blue shrink-0" />
                    <span className="font-mono text-xs font-bold">Dataset Hackathon Top 25</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 font-semibold mt-1">
                    Created predictive classification loops under highly restrictive computation setups.
                  </p>
                </div>
              </div>

              {/* 6. Deloitte Consulting */}
              <div className="bg-white text-black border-2 border-black p-3 rounded-lg shadow-neo-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-brand-orange shrink-0" />
                    <span className="font-mono text-xs font-bold">Deloitte Consulting Cert.</span>
                  </div>
                  <div className="text-[9px] font-bold text-neutral-400 font-mono mt-0.5 ml-7">Forage Job Simulation</div>
                  <p className="text-[10px] text-neutral-600 font-semibold mt-1">
                    Completed virtual consulting case studies, analyzing software architecture and migration plans.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-white/70">
              Verified by VIT Chennai and university/event boards.
            </p>
          </section>

          {/* 13. Contact Card (Span: 12) */}
          <section className="col-span-12" id="contact">
            <div className="w-full bg-brand-blue text-white rounded-xl border-[3px] border-black shadow-neo overflow-hidden flex flex-col font-body">
              {/* Header Title */}
              <div className="bg-black text-white px-4 py-2 border-b-[3px] border-black flex items-center justify-between font-mono font-bold">
                <span>📁 SENDMESSAGE.EXE</span>
                <span className="text-xs text-neutral-400">STATUS: PORT CONNECTED</span>
              </div>

              {/* Grid content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Info panel */}
                <div className="md:col-span-4 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-3xl font-display font-black leading-none tracking-tight text-white mb-2">
                      Get in Touch
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed font-semibold">
                      Ready to build something impactful? Drop a line here. The mailbox is parsed periodically and logged.
                    </p>
                  </div>

                  <div className="font-mono text-xs font-bold bg-black/25 p-3 rounded-lg border border-black/35">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-brand-teal" />
                      <span>garvikjain6@gmail.com</span>
                    </div>
                  </div>
                </div>

                {/* Form panel */}
                <form onSubmit={handleContactSubmit} className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="form-name" className="text-xs font-mono font-bold uppercase text-white/90">Your Name</label>
                      <input 
                        id="form-name"
                        type="text" 
                        placeholder="e.g. Recruiter / Partner"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className={`p-3 bg-white text-black border-2 border-black rounded-lg text-sm font-semibold shadow-neo-sm focus:outline-none focus:-translate-y-0.5 focus:shadow-neo transition-all ${formErrors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="form-email" className="text-xs font-mono font-bold uppercase text-white/90">Email Address</label>
                      <input 
                        id="form-email"
                        type="email" 
                        placeholder="e.g. company@partner.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className={`p-3 bg-white text-black border-2 border-black rounded-lg text-sm font-semibold shadow-neo-sm focus:outline-none focus:-translate-y-0.5 focus:shadow-neo transition-all ${formErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label htmlFor="form-msg" className="text-xs font-mono font-bold uppercase text-white/90">Message Body</label>
                    <textarea 
                      id="form-msg"
                      rows={3} 
                      placeholder="Hi Garvik, let's connect regarding an AI opportunity..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className={`p-3 bg-white text-black border-2 border-black rounded-lg text-sm font-semibold shadow-neo-sm focus:outline-none focus:-translate-y-0.5 focus:shadow-neo transition-all resize-none ${formErrors.message ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#06D6A0] text-black hover:bg-[#05b88a] border-2 border-black font-mono font-black text-sm rounded-lg shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                  >
                    SEND_MESSAGE.EXE
                  </button>
                </form>
              </div>
            </div>
          </section>
          
        </main>

        {/* Windows 98 Status Bar Footer */}
        <footer className="bg-[#FBFAF5] text-black border-[3px] border-black rounded-xl shadow-neo py-2 px-4 flex items-center justify-between font-mono text-[10px] font-bold select-none">
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 bg-green-600 rounded-full border border-black shrink-0 animate-pulse"></span>
            <span>SYSTEM: READY</span>
          </div>
          <div>Built with ❤️ for AI engineering</div>
          <div>© {new Date().getFullYear()} Garvik Jain</div>
        </footer>

      </div>

      {/* Retro Alert Toast Box */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-80 bg-[#FBFAF5] text-black border-[3px] border-black rounded-xl shadow-neo-lg font-body overflow-hidden"
          >
            <div className="bg-[#000080] text-white px-3 py-1 font-mono font-bold text-xs flex justify-between items-center">
              <span>System Alert</span>
              <button onClick={() => setToastMessage(null)} className="font-bold">✕</button>
            </div>
            <div className="p-4 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-full bg-[#06D6A0] flex items-center justify-center shrink-0 border border-black">
                <Check className="w-4 h-4 text-white stroke-[3]" />
              </div>
              <p className="text-xs font-mono font-bold leading-relaxed">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
