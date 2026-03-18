import { useState, useEffect, useRef } from 'react';

// District paths traced from Belize's actual geography
// ViewBox ~160x275, western border nearly straight at x≈14
// Coordinates derived from lat/lon projection
const districts = [
  {
    id: 'corozal',
    path: 'M 42,50 L 48,44 L 55,37 L 62,30 L 70,22 L 78,16 L 86,12 L 95,11 L 99,16 L 102,24 L 105,33 L 107,42 L 109,52 L 111,62 L 112,70 L 112,76 L 70,82 Z',
    active: false,
  },
  {
    id: 'orange-walk',
    path: 'M 14,71 L 22,68 L 30,62 L 36,55 L 42,50 L 70,82 L 55,128 L 14,128 Z',
    active: true,
  },
  {
    id: 'belize',
    path: 'M 70,82 L 112,76 L 114,84 L 116,92 L 118,100 L 120,108 L 122,116 L 124,124 L 126,132 L 125,140 L 122,148 L 119,155 L 116,162 L 114,168 L 75,168 L 55,128 Z',
    active: true,
  },
  {
    id: 'cayo',
    path: 'M 14,128 L 55,128 L 75,168 L 45,222 L 14,222 Z',
    active: false,
  },
  {
    id: 'stann-creek',
    path: 'M 75,168 L 114,168 L 111,176 L 108,184 L 104,192 L 100,200 L 96,208 L 92,215 L 87,222 L 82,228 L 78,232 L 45,222 Z',
    active: true,
  },
  {
    id: 'toledo',
    path: 'M 14,222 L 45,222 L 78,232 L 72,239 L 65,245 L 57,251 L 49,256 L 42,259 L 36,260 L 29,254 L 22,244 L 17,234 L 14,226 Z',
    active: false,
  },
  {
    id: 'ambergris',
    path: 'M 130,25 L 135,22 L 138,30 L 137,42 L 136,55 L 134,66 L 132,74 L 128,72 L 129,58 L 130,45 L 130,35 Z',
    active: true,
  },
];

const locations = [
  { id: 'ambergris', name: 'San Pedro, Ambergris Caye', detail: 'Holy Cross Anglican School • Island Clinics', frequency: 'Year-Round', dot: { x: 133, y: 48 } },
  { id: 'belize', name: 'Belize City', detail: "St. John's Primary • Inner-city Outreach", frequency: 'Quarterly', dot: { x: 120, y: 135 } },
  { id: 'orange-walk', name: 'Orange Walk Town', detail: 'Community Center Pavilion • Sugar City', frequency: 'Bi-Annual', dot: { x: 40, y: 92 } },
  { id: 'stann-creek', name: 'Dangriga & Southern Belize', detail: 'Coastal Community Outreach', frequency: 'Annual Mission', dot: { x: 95, y: 198 } },
];

const WhereWeWork = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    containerRef.current?.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 bg-white flex flex-col items-center" ref={containerRef}>

      <div className="relative z-10 text-center mb-16 fade-in max-w-[600px] px-6">
        <span className="text-brand-navy font-poppins font-bold uppercase tracking-widest text-[13px] mb-4 flex w-fit mx-auto items-center gap-2 bg-brand-sky-soft px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-sky animate-pulse"></span>
          Clinic Locations
        </span>
        <h2 className="font-poppins text-[48px] text-brand-navy tracking-tight relative inline-block">
          Where We <span className="text-brand-sky">Work</span>
          <svg className="absolute -left-2 -bottom-2 w-[110%] h-5 text-brand-sky opacity-30" viewBox="0 0 200 20" preserveAspectRatio="none">
            <path d="M0,15 Q100,-5 200,15" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </h2>
      </div>

      <div className="relative z-10 w-full max-w-[1100px] px-6 fade-in delay-100 flex flex-col md:flex-row gap-12 md:gap-16 items-center">

        {/* Interactive SVG Map of Belize */}
        <div className="w-full md:w-[45%] flex justify-center">
          <svg viewBox="-2 0 155 275" className="w-full max-w-[300px] h-auto">
            {/* District shapes */}
            {districts.map((d) => (
              <path
                key={d.id}
                d={d.path}
                fill={
                  hovered === d.id
                    ? 'var(--color-brand-sky)'
                    : d.active
                    ? 'var(--color-brand-sky-light)'
                    : 'var(--color-brand-sky-soft)'
                }
                stroke="white"
                strokeWidth={1.5}
                strokeLinejoin="round"
                className={`transition-colors duration-300 ${d.active ? 'cursor-pointer' : ''}`}
                onMouseEnter={() => d.active && setHovered(d.id)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}

            {/* City marker dots */}
            {locations.map((loc) => (
              <g
                key={loc.id}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(loc.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === loc.id && (
                  <circle cx={loc.dot.x} cy={loc.dot.y} r="8" fill="var(--color-brand-navy)" opacity="0.12" />
                )}
                <circle
                  cx={loc.dot.x}
                  cy={loc.dot.y}
                  r={hovered === loc.id ? 4 : 3}
                  fill={hovered === loc.id ? 'var(--color-brand-navy)' : 'white'}
                  stroke="var(--color-brand-navy)"
                  strokeWidth={1.2}
                  className="transition-all duration-200"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Location Cards */}
        <div className="w-full md:w-[55%] flex flex-col gap-4">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                hovered === loc.id
                  ? 'bg-brand-sky-soft border-brand-sky shadow-[0_8px_24px_rgba(124,174,235,0.25)]'
                  : 'bg-white border-brand-sky-light/40 hover:border-brand-sky-light'
              }`}
              onMouseEnter={() => setHovered(loc.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-poppins text-[18px] font-bold text-brand-navy mb-1">{loc.name}</h3>
                  <p className="font-inter text-[14px] text-brand-navy/55">{loc.detail}</p>
                </div>
                <span
                  className={`shrink-0 font-inter text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors duration-300 ${
                    hovered === loc.id ? 'bg-brand-navy text-white' : 'bg-brand-sky-soft text-brand-navy/70'
                  }`}
                >
                  {loc.frequency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default WhereWeWork;
