import { useEffect, useRef } from 'react';

const Ambassador = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll('.fade-in');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="ambassador" className="relative py-24 md:py-32 bg-white flex flex-col items-center overflow-hidden" ref={containerRef}>

      {/* Hand-drawn organic background swathe (Brand Sky opacity) */}
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[600px] z-0 pointer-events-none">
        <svg viewBox="0 0 500 500" preserveAspectRatio="none" className="w-full h-full fill-brand-sky-soft opacity-60">
           <path d="M404.7,212.8c-23.7-27.4-53.9-46.6-88.8-51.5c-42.5-6-84.5,10.1-119.5,35.2c-35,25.1-66.2,56.5-103.1,77.7c-38.6,22.2-83.3,31-124.9,13.8c-36-14.9-66.4-42.8-88.8-74.8c-2-2.9-6.3-2.2-7.8,0.9c-16.7,35-23.4,74.7-18,114.1c11.5,84.5,74.2,156.4,153.5,183.1c73.9,24.9,157.1,16.5,225.5-22.1c68-38.4,124.7-98.8,142.9-173.8C480.9,291.6,446.5,261.2,404.7,212.8z"/>
        </svg>
      </div>

      {/* Subtle SVG line art decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute left-[5%] bottom-[10%] w-[100px] h-[120px] -rotate-12 opacity-[0.05]" viewBox="0 0 100 120" fill="none" stroke="var(--color-brand-sky)" strokeWidth="2">
          <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
        </svg>
        <svg className="absolute right-[6%] top-[20%] w-[70px] h-[85px] rotate-[15deg] opacity-[0.04]" viewBox="0 0 100 120" fill="none" stroke="var(--color-brand-sky)" strokeWidth="2">
          <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
        </svg>
      </div>

      <div className="relative z-10 text-center mb-16 fade-in px-6">
        <span className="text-brand-navy font-poppins font-bold uppercase tracking-widest text-[13px] mb-4 block inline-flex items-center gap-2 bg-brand-sky-soft px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-sky animate-pulse"></span>
          Our Team
        </span>
        <h2 className="font-poppins text-[48px] text-brand-navy tracking-tight relative inline-block">
          The <span className="text-brand-sky">Heart</span> of Our Work
          <svg className="absolute -left-4 -bottom-4 w-[120%] h-6 text-brand-sky opacity-30" viewBox="0 0 200 20" preserveAspectRatio="none">
              <path d="M5,15 Q100,0 195,12" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </h2>
        <p className="font-inter text-lg text-brand-navy/70 mt-8 max-w-[650px] mx-auto">
          Discover the passionate volunteers who donate their time and expertise, where compassion meets professional possibility.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 fade-in delay-100 flex flex-wrap justify-center gap-x-12 gap-y-16 mt-8">
        {[
          {
            img: "ambassador-crown-waving.jpg",
            name: "Faith Edgar",
            role: "Miss World Belize 2025",
            accent: "bg-brand-sky/20"
          },
          {
            img: "volunteers-talking-students.jpg",
            name: "Dr. Sarah T.",
            role: "Lead Pediatric Dentist",
            accent: "bg-brand-navy/10"
          },
          {
            img: "ambassador-goggles-treating.jpg",
            name: "Maria C.",
            role: "Community Coordinator",
            accent: "bg-brand-sky/20"
          },
          {
            img: "students-brushing-uniforms.jpg",
            name: "Mr. Lopez",
            role: "School Outreach",
            accent: "bg-brand-navy/10"
          }
        ].map((person, idx) => (
          <div key={idx} className="flex flex-col items-center text-center group cursor-pointer w-[180px]">
             
            <div className="relative mb-6">
              {/* Offset decorative blob/brush behind image */}
              <div className={`absolute -inset-2 ${person.accent} rounded-full opacity-0 group-hover:opacity-100 -z-10 transition-all duration-300 scale-90 group-hover:scale-105 blur-md`}></div>
              <div className={`w-[140px] h-[140px] rounded-full overflow-hidden border-[6px] border-white transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_12px_24px_rgba(34,72,136,0.15)] bg-brand-sky-soft`}>
                <img src={`/images/${person.img}`} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
            
            <h3 className="font-poppins text-[18px] font-bold text-brand-navy mb-1 group-hover:text-brand-sky transition-colors">
              {person.name}
            </h3>
            <span className="font-inter text-[14px] text-brand-navy/60">
              {person.role}
            </span>
          </div>
        ))}
      </div>

      {/* Button adhering to deep brand cohesion */}
      <div className="relative z-10 mt-20 fade-in delay-200">
        <a href="#donate" className="inline-flex items-center justify-center h-[52px] px-8 rounded-full font-poppins font-semibold text-[15px] bg-white text-brand-navy border border-gray-200 hover:border-brand-sky hover:bg-brand-sky-soft transition-all duration-300 gap-3 group shadow-sm hover:shadow-md">
          Join the Team
          <span className="w-6 h-6 rounded-full bg-brand-sky-soft group-hover:bg-brand-navy flex items-center justify-center text-brand-navy group-hover:text-white transition-colors">
            +
          </span>
        </a>
      </div>
      
    </section>
  );
};

export default Ambassador;
