import { Globe } from 'lucide-react';

interface LanguageProficiency {
  name: string;
  level: string;
  score: number; // 1 to 5 segments (supports fractions)
  colorClass: string;
}

export default function Languages() {
  const languages: LanguageProficiency[] = [
    {
      name: 'English',
      level: 'Native Proficiency',
      score: 5,
      colorClass: 'bg-[#6A4CFF]', // purple
    },
    {
      name: 'Hindi',
      level: 'Native Proficiency',
      score: 5,
      colorClass: 'bg-[#F26419]', // orange
    },
    {
      name: 'Kannada',
      level: 'Professional Proficiency',
      score: 4,
      colorClass: 'bg-[#06D6A0]', // teal
    },
    {
      name: 'French',
      level: 'Limited Proficiency',
      score: 3.5,
      colorClass: 'bg-[#ff5c5c]', // coral
    },
  ];

  return (
    <div className="w-full bg-[#FBFAF5] text-black p-6 border-[3px] border-black rounded-xl shadow-neo font-body flex flex-col justify-between h-full min-h-[300px]">
      <div>
        {/* Title Header */}
        <div className="flex items-center space-x-2 border-b-2 border-black pb-3 mb-6 select-none">
          <Globe className="w-5 h-5 text-brand-blue" />
          <span className="text-xl font-display font-black tracking-tight">Languages.dll</span>
        </div>

        {/* Content list */}
        <div className="space-y-4 font-mono">
          {languages.map((lang, idx) => (
            <div key={idx} className="bg-white border-2 border-black p-3 rounded-lg shadow-neo-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-black uppercase tracking-wide">{lang.name}</span>
                <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 border border-black/10 px-1.5 py-0.5 rounded">
                  {lang.level}
                </span>
              </div>

              {/* Segmented signal strength bar with support for fractional fills */}
              <div className="flex space-x-1.5">
                {[1, 2, 3, 4, 5].map((segment) => {
                  let fillRatio = 0;
                  if (segment <= lang.score) {
                    fillRatio = 1;
                  } else if (segment - 1 < lang.score) {
                    fillRatio = lang.score - (segment - 1);
                  }

                  return (
                    <div
                      key={segment}
                      className="h-4.5 flex-1 border-2 border-black rounded bg-neutral-100 overflow-hidden relative"
                    >
                      {fillRatio > 0 && (
                        <div
                          className={`absolute inset-y-0 left-0 ${lang.colorClass} shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.35)]`}
                          style={{ width: `${fillRatio * 100}%` }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-[9px] font-mono font-bold text-neutral-400 select-none">
        <span>LOCALE: IN-KA</span>
        <span>STATUS: ACTIVE_SPEECH</span>
      </div>
    </div>
  );
}
