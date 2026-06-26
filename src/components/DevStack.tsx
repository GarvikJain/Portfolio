import { useState } from 'react';
import { Folder, FolderOpen, FileCode, ArrowLeft } from 'lucide-react';

interface Skill {
  name: string;
  level: string;
  type: string;
}

interface Folders {
  [key: string]: Skill[];
}

export default function DevStack() {
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const folders: Folders = {
    Languages: [
      { name: 'Python', level: 'Advanced', type: 'Language' },
      { name: 'C++', level: 'Advanced', type: 'Language' },
      { name: 'JavaScript', level: 'Advanced', type: 'Language' },
      { name: 'HTML & CSS', level: 'Advanced', type: 'Language' },
      { name: 'PostgreSQL', level: 'Intermediate', type: 'Database/SQL' },
      { name: 'Java', level: 'Intermediate', type: 'Language' },
      { name: 'C', level: 'Intermediate', type: 'Language' },
      { name: 'R', level: 'Intermediate', type: 'Language' },
      { name: 'Matlab', level: 'Intermediate', type: 'Language' },
      { name: 'Assembly (8051,8086,ARM)', level: 'Basic', type: 'Architecture/ASM' },
    ],
    Frameworks: [
      { name: 'React.js', level: 'Advanced', type: 'Library' },
      { name: 'Flask', level: 'Advanced', type: 'Framework' },
      { name: 'Scikit-learn', level: 'Advanced', type: 'ML Library' },
      { name: 'Tensorflow', level: 'Intermediate', type: 'DL Library' },
      { name: 'Torch (PyTorch)', level: 'Intermediate', type: 'DL Library' },
      { name: 'OpenCV', level: 'Intermediate', type: 'Computer Vision' },
      { name: 'Node.js & Express.js', level: 'Intermediate', type: 'Runtime/Backend' },
      { name: 'MongoDB', level: 'Intermediate', type: 'NoSQL DB' },
      { name: 'Socket.io', level: 'Intermediate', type: 'Real-time Communication' },
      { name: 'Firebase', level: 'Intermediate', type: 'BaaS' },
      { name: 'Figma', level: 'Intermediate', type: 'Design Tool' },
      { name: 'Vue.js', level: 'Basic', type: 'Library' },
      { name: 'LibGDX', level: 'Basic', type: 'Game Dev Library' },
    ],
    Tools_Systems: [
      { name: 'Git & GitHub', level: 'Advanced', type: 'Version Control' },
      { name: 'Database Management', level: 'Advanced', type: 'DBMS Concept' },
      { name: 'Linux', level: 'Intermediate', type: 'Operating System' },
      { name: 'Google Cloud', level: 'Intermediate', type: 'Cloud Platform' },
      { name: 'Redis', level: 'Intermediate', type: 'In-Memory Cache' },
      { name: 'Tableau', level: 'Intermediate', type: 'Data Visualization' },
      { name: 'CISC & RISC', level: 'Intermediate', type: 'Hardware Arch.' },
      { name: 'PowerBI', level: 'Basic', type: 'Data Visualization' },
    ],
    Core_Domains: [
      { name: 'Data Structures & Algorithms', level: 'Advanced', type: 'Computer Science' },
      { name: 'Machine Learning', level: 'Advanced', type: 'Domain' },
      { name: 'Full Stack Development', level: 'Advanced', type: 'Domain' },
      { name: 'Deep Learning', level: 'Intermediate', type: 'Domain' },
      { name: 'Computer Vision', level: 'Intermediate', type: 'Domain' },
      { name: 'Image Processing', level: 'Intermediate', type: 'Domain' },
      { name: 'Optimization', level: 'Intermediate', type: 'Domain' },
      { name: 'Multithreading', level: 'Intermediate', type: 'Domain' },
      { name: 'Cloud Computing', level: 'Intermediate', type: 'Domain' },
      { name: 'Distributed Computing', level: 'Basic', type: 'Domain' },
    ],
  };

  return (
    <div className="w-full h-full bg-[#FBFAF5] text-black font-body p-4 rounded-xl flex flex-col border-[3px] border-black shadow-neo relative overflow-hidden select-none">
      {/* Title window bar */}
      <div className="flex items-center justify-between bg-[#000080] text-white px-2 py-1 mb-4 border border-black text-xs font-mono font-bold">
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 border border-white flex items-center justify-center text-[8px] bg-red-600 font-sans font-bold cursor-pointer">✕</span>
          <span>C:\Windows\System32\explorer.exe</span>
        </div>
        <div className="text-[10px]">4 Object(s)</div>
      </div>

      {activeFolder === null ? (
        // Folder Explorer Grid
        <div className="flex-1 grid grid-cols-2 gap-4 items-center justify-center p-2">
          {Object.keys(folders).map((folderName) => (
            <button
              key={folderName}
              onClick={() => setActiveFolder(folderName)}
              className="flex flex-col items-center justify-center p-3 border-2 border-transparent hover:border-black hover:bg-[#ffe066]/30 rounded-lg transition-all duration-150 active:translate-y-[2px]"
            >
              <Folder className="w-12 h-12 text-[#FFD000] fill-[#FFD000] stroke-[1.5] filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]" />
              <span className="mt-2 text-xs font-mono font-bold tracking-tight text-center">
                {folderName.replace('_', ' ')}
              </span>
            </button>
          ))}
        </div>
      ) : (
        // Contents of the opened Folder
        <div className="flex-1 flex flex-col">
          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={() => setActiveFolder(null)}
              className="flex items-center justify-center px-2 py-1 border-2 border-black bg-white hover:bg-neutral-100 rounded text-xs font-mono font-bold shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <ArrowLeft className="w-3 h-3 mr-1" /> Up
            </button>
            <div className="flex items-center text-xs font-mono font-semibold bg-neutral-200/50 border border-neutral-300 px-2 py-1 rounded flex-1 truncate">
              <FolderOpen className="w-3.5 h-3.5 mr-1.5 text-[#FFD000] fill-[#FFD000]/60 shrink-0" />
              <span>Skills / {activeFolder.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[170px] custom-scrollbar">
            {folders[activeFolder].map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white border-2 border-black rounded-lg shadow-neo-sm hover:translate-y-[-1px] transition-transform"
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-brand-teal" />
                  <div>
                    <div className="text-xs font-mono font-bold leading-tight">{skill.name}</div>
                    <div className="text-[9px] text-neutral-500 font-mono leading-none mt-0.5">{skill.type}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold border border-black bg-brand-cream px-1.5 py-0.5 rounded shrink-0">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
