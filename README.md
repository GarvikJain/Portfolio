# Garvik Jain - Neo-Brutalist Y2K Bento Portfolio Website

This repository contains the design, code, and canvas visualizers for a premium, highly interactive personal portfolio website for **Garvik Jain** (Computer Science undergraduate at VIT Chennai, specializing in AI & ML).

The site utilizes a Y2K Neo-Brutalist aesthetic inspired by Windows 98 desktop elements, visual folder explorers, bento grid structures, and interactive diagnostic prompts.

---

## 🚀 Key Features

1. **GarvikOS Y2K BIOS Boot Preloader**:
   - Displays a realistic retro BIOS system check overlay on initial entry or reload.
   - Logs simulated file loading checkpoints (`languages.dll`, `rag_engine.sys`, `projects.dat`) and counts from 0% to 100% in precisely 1.5 seconds with CRT monitor scanline filters.
   - Transitions out smoothly with a fade-out animation once loaded.
2. **Manual Scroll Restoration & Jump Prevention**:
   - Disables default browser scroll restoration so that the page always opens cleanly at the top Bio section on refresh.
   - Fixes terminal autofocus scroll jumps during component initial render.
3. **Interactive MS-DOS Prompt (`Terminal.tsx`)**:
   - A fully functional simulated terminal prompt supporting query commands (`help`, `whoami`, `focus`, `skills`, `contact`, `clear`).
4. **Windows Explorer DevStack (`DevStack.tsx`)**:
   - A mockup folder browser displaying programming languages, libraries/frameworks, tools, and developer domains.
5. **Five Custom Canvas Visualizers (`ProjectGrid.tsx`)**:
   - **Multi-Modal RAG System**: Simulates retrieval vectors moving from text chunks, image scans, and CSV sheets into a cylinder Vector DB and LLM generator.
   - **Portfolio Website**: An auto-scaling bento grid replica displaying nested recursion (picture-in-picture) and an automated pointer action.
   - **VIT Chennai Outing Planner**: Maps nodes (VIT Chennai, Vandalur Zoo, Marina Mall, Kovalam Beach, Mahabalipuram) responsively with travel segments and pathfinding trails.
   - **ATS Resume Parser**: Splits canvas into JD requirements scan, a document visualizer swept by a green laser scanner with diagnostic terminal logs, and candidate scoring charts.
   - **Mind-bodyHub**: Renders a dense 6-widget health dashboard including live heart ECG lines, activity rings, sleep cycles, hydration sloshing waves, nutrition macros, and breathing stress guides.
6. **Day & Night Mode Switcher**:
   - Navbar toggle switches between **Dark Space** mode (charcoal black background, radial indigo glow, and falling stars/shooting meteor trails canvas) and **Morning Sunlight** mode (warm beige-brown background, golden morning sunbeams, and drifting air dust motes canvas).
7. **Languages Section (`Languages.tsx`)**:
   - Displays English, Hindi, Kannada, and French proficiencies using retro segmented bars supporting fractional fills.
8. **Achievements & Certifications**:
   - Houses academic and course honors (VIT Chennai Meritorious Award Rank-1, Google AI, NPTEL Public Speaking Top 1%, IIT Kanpur, Deloitte Tech Consulting).

---

## 📬 Contact Form Delivery

The contact form is connected to your email via the free **FormSubmit.co** AJAX API.
- **How it works**: When a user fills out name, email, and message and clicks `SEND_MESSAGE.EXE`, the form sends a secure JSON payload to the FormSubmit forwarding service, which emails you at `garvikjain6@gmail.com` in real time.
- **Activation note**: The first time someone submits a message, FormSubmit.co will send a verification link to your email (`garvikjain6@gmail.com`). Simply click that verification link once to authorize the form to deliver messages directly to your inbox. All subsequent submissions will be delivered instantly.

---

## 🛠️ Technical Stack
- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS v4.0 (CSS-first directives, zero JS config)
- **Animations**: Framer Motion
- **Icons**: Lucide React / Custom Inline SVGs
- **Build Tool**: Vite

---

## 💻 How to Run Local Development

1. Ensure you have **Node.js** installed.
2. Open this directory in your terminal:
   ```bash
   cd D:\portfolio
   ```
3. Install package dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.
