import { useEffect, useRef } from 'react';

const DonateCTA = () => {
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
    <section id="donate" className="relative py-24 md:py-32 bg-brand-navy text-white text-center overflow-hidden" ref={containerRef}>
      
      {/* Decorative SVG curves fading into background */}
      <div className="absolute top-0 left-0 w-full h-[50%] overflow-hidden pointer-events-none opacity-10">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full absolute -top-10 left-0">
          <path fill="#7CAEEB" d="M 0,100 C 300,300 700,0 1000,100 L 1000,0 L 0,0 Z"></path>
        </svg>
      </div>

      {/* Subtle SVG decorations on dark background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute right-[15%] bottom-[20%] w-[80px] h-[100px] rotate-[20deg] opacity-[0.06]" viewBox="0 0 100 120" fill="none" stroke="#7CAEEB" strokeWidth="2">
          <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
        </svg>
        <svg className="absolute left-[8%] top-[25%] w-[60px] h-[75px] -rotate-12 opacity-[0.04]" viewBox="0 0 100 120" fill="none" stroke="#7CAEEB" strokeWidth="2">
          <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-[800px] mx-auto px-6 fade-in flex flex-col items-center">
        
        <div className="w-20 h-20 bg-brand-sky/20 rounded-full flex items-center justify-center mb-8 border border-brand-sky/30">
          <div className="w-12 h-12 bg-brand-sky rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" viewBox="0 0 100 120" fill="currentColor"><path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/></svg>
          </div>
        </div>

        <h2 className="font-poppins text-[48px] md:text-[64px] font-black tracking-tight mb-6 leading-[1.1] text-white">
          Help Us Keep <br/> Belize <span className="text-brand-sky relative">Smiling</span>
        </h2>
        
        <p className="font-inter text-lg text-white/80 max-w-[600px] mx-auto mb-10 leading-relaxed font-light">
          Your support directly funds essential dental treatments, preventative education, and community healthcare initiatives. Every contribution creates a lasting impact.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 fade-in delay-200 w-full sm:w-auto">
          <a href="#" className="w-full sm:w-auto inline-flex items-center justify-center h-[60px] px-10 rounded-full bg-brand-sky text-white font-poppins font-bold text-[18px] hover:bg-white hover:text-brand-navy hover:-translate-y-1 transition-all duration-300 shadow-[0_12px_24px_rgba(124,174,235,0.3)] hover:shadow-[0_12px_24px_rgba(255,255,255,0.3)]">
            Donate Now
          </a>
          <a href="#programs" className="w-full sm:w-auto inline-flex items-center justify-center h-[60px] px-10 rounded-full bg-transparent border-2 border-white/20 text-white font-poppins font-bold text-[18px] hover:bg-white/10 transition-colors duration-300">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default DonateCTA;
