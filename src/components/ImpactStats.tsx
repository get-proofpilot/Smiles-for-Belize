import { useEffect, useRef } from 'react';

const ImpactStats = () => {
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
    <section id="impact" className="relative py-24 bg-dental-bg flex flex-col items-center overflow-hidden" ref={containerRef}>

      {/* Subtle SVG background decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute left-0 bottom-0 w-[200px] h-[250px] opacity-[0.05]" viewBox="0 0 200 250" fill="none" stroke="var(--color-brand-sky)" strokeWidth="3" strokeLinecap="round">
          <path d="M20,250 C20,200 10,180 30,150 C40,130 25,120 35,100 C45,80 30,70 40,50 C50,30 35,20 50,10 M60,250 C60,220 70,200 55,180 C45,160 65,140 55,120 C50,100 65,80 60,60 M100,250 C100,230 90,210 105,190 C115,170 95,155 110,135 C120,115 105,100 115,80 C125,60 110,45 120,25 M140,250 C140,220 150,200 135,175 C125,155 145,135 135,115 C130,95 150,80 140,60 M180,250 C180,230 170,210 185,190 C190,170 175,155 185,140 C195,120 180,100 190,80 C195,60 185,45 195,30"/>
        </svg>
      </div>

      {/* Hero & Intro Text */}
      <div className="relative z-10 w-full max-w-[1100px] text-left mx-auto mb-16 px-6 fade-in flex flex-col md:flex-row justify-between items-end">
        <div className="max-w-[600px]">
          <h2 className="text-[40px] md:text-[56px] font-poppins font-black text-brand-navy tracking-tight mb-4 leading-[1.1]">
            We're Making a <br/>
            <span className="text-brand-sky bg-brand-sky-soft px-4 py-1 rounded-xl">Difference</span>
          </h2>
          <p className="font-inter text-[16px] md:text-[18px] text-brand-navy/70 leading-relaxed">
            Smiles for Belize transforms lives by providing free, comprehensive dental care to underserved communities. We foster oral health and community well-being, creating a 
            brighter future for thousands of children.
          </p>
        </div>
        
        <div className="mt-8 md:mt-0 pb-2">
           <a href="#donate" className="bg-white text-brand-navy font-poppins font-bold text-[13px] uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform border border-brand-sky-soft flex items-center gap-3 group">
             Our Impact 
             <span className="w-8 h-8 rounded-full bg-brand-sky-soft text-brand-navy flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors">+</span>
           </a>
        </div>
      </div>

      {/* The Bento Grid (Strict Brand Adherence) */}
      <div className="relative z-10 max-w-[1100px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 fade-in delay-200">
        
        {/* Large Feature Card (Col Span 2) */}
        <div className="md:col-span-2 md:row-span-2 relative rounded-[32px] overflow-hidden shadow-sm group">
          <img src="/images/volunteers-talking-students.jpg" alt="Impact" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/50 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="w-16 h-16 bg-white rounded-2xl mb-8 flex items-center justify-center shadow-lg -rotate-3 overflow-hidden">
               <img src="/images/illustrations/cutout-faith-examining.webp" alt="Care" className="w-full h-full object-cover"/>
            </div>
            <p className="font-poppins text-[20px] md:text-[26px] font-semibold text-white leading-[1.4] tracking-tight max-w-[500px]">
              "Many of these students had been living with severe pain for months. We couldn't save every tooth—but we saved their smile."
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="font-inter text-[14px] font-bold text-brand-sky uppercase tracking-widest block">Maria V.</span>
              <span className="font-inter text-[14px] text-white/70">Lead Volunteer</span>
            </div>
          </div>
        </div>

        {/* Highlight Sky Blue Stat */}
        <div className="rounded-[32px] bg-brand-sky text-white p-8 md:p-10 flex flex-col justify-end shadow-sm hover:shadow-[0_20px_40px_rgba(124,174,235,0.4)] transition-shadow relative overflow-hidden">
          {/* Background tooth watermark */}
          <svg className="absolute right-[-20px] top-[-20px] w-[140px] h-[170px] opacity-[0.12] rotate-12" viewBox="0 0 100 120" fill="white">
            <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
          </svg>
          <div className="w-12 h-12 mb-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" viewBox="0 0 100 120" fill="currentColor"><path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/></svg>
          </div>
          <h3 className="font-poppins text-[48px] md:text-[56px] font-black mb-1 leading-none tracking-tighter">
            1,200+
          </h3>
          <span className="font-inter text-[15px] font-bold text-white/90 leading-tight">
            Children treated with comprehensive care.
          </span>
        </div>

        {/* Solid Navy Stat */}
        <div className="rounded-[32px] bg-brand-navy p-8 md:p-10 flex flex-col justify-end shadow-sm hover:shadow-[0_20px_40px_rgba(34,72,136,0.3)] transition-shadow relative overflow-hidden">
          {/* Background school icon watermark */}
          <svg className="absolute right-[-10px] top-[-10px] w-[120px] h-[120px] opacity-[0.08]" viewBox="0 0 24 24" fill="white">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
          <div className="w-12 h-12 mb-auto bg-white/10 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-sky" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>
          </div>
          <h3 className="font-poppins text-[48px] md:text-[56px] font-black text-white mb-1 leading-none tracking-tighter">
            15
          </h3>
          <span className="font-inter text-[15px] font-bold text-brand-sky leading-tight">
            Primary schools visited for local screenings.
          </span>
        </div>

        {/* Lower Row Stats */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 mt-0">
          
          <div className="bg-white border border-brand-sky-light/50 rounded-[32px] p-8 md:p-10 flex items-center justify-between shadow-sm hover:shadow-lg transition-shadow">
            <div>
              <h3 className="font-poppins text-[40px] md:text-[48px] font-black text-brand-navy mb-1 leading-none tracking-tighter">
                50+
              </h3>
              <span className="font-inter text-[15px] font-bold text-brand-navy/60 leading-tight block max-w-[150px]">
                Expert dentists volunteering time.
              </span>
            </div>
            <div className="w-20 h-20 bg-brand-sky-soft rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
          </div>

          <div className="bg-brand-sky-soft border border-brand-sky/20 rounded-[32px] p-8 md:p-10 flex items-center justify-between shadow-sm hover:shadow-lg transition-shadow">
            <div>
              <h3 className="font-poppins text-[40px] md:text-[48px] font-black text-brand-sky mb-1 leading-none tracking-tighter">
                6
              </h3>
              <span className="font-inter text-[15px] font-bold text-brand-navy/70 leading-tight block max-w-[150px]">
                Belizean districts fully covered.
              </span>
            </div>
            <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-brand-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default ImpactStats;
