import { useEffect, useRef } from 'react';

const Programs = () => {
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
    <section id="programs" className="relative py-24 md:py-32 bg-white overflow-hidden flex flex-col items-center" ref={containerRef}>
      
      {/* Soft Background Accent */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-brand-sky-soft rounded-full blur-[100px] pointer-events-none opacity-50 z-0"></div>

      {/* Monochrome Line-Art Decorations (like reference coral/shell outlines) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Tooth outline — top right */}
        <svg className="absolute right-[3%] top-[5%] w-[140px] h-[170px] rotate-[15deg] opacity-[0.06]" viewBox="0 0 100 120" fill="none" stroke="var(--color-brand-sky)" strokeWidth="2">
          <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
        </svg>
        {/* Dental mirror — bottom left */}
        <svg className="absolute left-[2%] bottom-[8%] w-[100px] h-[200px] -rotate-[30deg] opacity-[0.06]" viewBox="0 0 80 160" fill="none" stroke="var(--color-brand-sky)" strokeWidth="2" strokeLinecap="round">
          <circle cx="40" cy="30" r="22"/>
          <line x1="40" y1="52" x2="40" y2="155"/>
        </svg>
        {/* Sparkle stars scattered */}
        <svg className="absolute right-[8%] bottom-[15%] w-[40px] h-[40px] opacity-[0.08]" viewBox="0 0 24 24" fill="var(--color-brand-sky)">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"/>
        </svg>
        <svg className="absolute left-[15%] top-[30%] w-[25px] h-[25px] opacity-[0.06]" viewBox="0 0 24 24" fill="var(--color-brand-sky)">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"/>
        </svg>
      </div>


      <div className="relative z-10 text-center mb-16 md:mb-20 fade-in max-w-[700px] px-6">
        <span className="text-brand-navy font-poppins font-bold uppercase tracking-widest text-[13px] mb-4 block inline-flex items-center gap-2 bg-brand-sky-soft px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand-sky animate-pulse"></span>
          What We Do
        </span>
        <h2 className="font-poppins text-[40px] md:text-[52px] text-brand-navy tracking-tight relative inline-block mb-6 leading-tight">
          Explore Our <span className="text-brand-sky">Causes</span>
          {/* Handdrawn warm underline */}
          <svg className="absolute -left-4 -bottom-3 md:-bottom-4 w-[120%] h-4 md:h-6 text-brand-sky opacity-40" viewBox="0 0 200 20" preserveAspectRatio="none">
              <path d="M5,15 Q100,0 195,12" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </h2>
        <p className="font-inter text-lg text-brand-navy/70 mt-4 max-w-[650px] mx-auto">
          We believe a healthy smile is a fundamental right. Our programs are engineered to reach every corner of the community with premium care and compassion.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 flex flex-col gap-10 md:gap-14">
        {[
          {
            img: "clinic-wide.jpg",
            loc: "Nationwide",
            title: "Community Clinics",
            desc: "Free comprehensive dental treatment provided in covered pavilions across Belize. We bring the clinic directly to the communities that need it most.",
            delay: ""
          },
          {
            img: "screening-child-outdoor.jpg",
            title: "School Screenings",
            loc: "Early Prevention",
            desc: "On-site checkups and preventative screenings at primary schools to catch issues early, preventing lifelong complications and pain.",
            delay: "delay-100"
          },
          {
            img: "students-brushing-uniforms.jpg",
            title: "Hygiene Education",
            loc: "Empowering Kids",
            desc: "Hands-on brushing workshops giving children the tools for lifelong oral health. We distribute toothbrushes and paste so they can practice what they learn.",
            delay: "delay-200"
          },
          {
            img: "ambassador-serving-community.jpg",
            title: "Outreach & Support",
            loc: "Holistic Care",
            desc: "Beyond teeth: food drives and wellness events supporting the whole family. A healthy smile starts with a healthy, well-nourished body.",
            delay: "delay-300"
          }
        ].map((item, idx) => (
          <div key={idx} className={`relative w-full h-[400px] md:h-[480px] rounded-[32px] rounded-tr-none overflow-hidden group shadow-md hover:shadow-[0_40px_80px_rgba(34,72,136,0.15)] transition-all duration-700 fade-in ${item.delay}`}>
            
            {/* Background Image */}
            <img src={`/images/${item.img}`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1000ms] ease-out" alt={item.title} loading="lazy" />
            
            {/* Deep Brand Navy Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/60 to-transparent mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* The Cutout Corner Button UI */}
            <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-white rounded-bl-[32px] z-20 flex items-center justify-center pointer-events-none">
              
              {/* Left Inverted SVG Fillet */}
              <svg className="absolute top-0 -left-[24px] w-[24px] h-[24px] fill-white pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0C13.255 0 24 10.745 24 24V0H0Z" />
              </svg>
              {/* Bottom Inverted SVG Fillet */}
              <svg className="absolute -bottom-[24px] right-0 w-[24px] h-[24px] fill-white pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 24C24 10.745 13.255 0 0 0H24V24Z" />
              </svg>
              
              {/* Interactive Button */}
              <button className="absolute top-3 right-3 w-14 h-14 bg-brand-navy text-white rounded-full flex items-center justify-center hover:bg-brand-sky transition-colors duration-300 pointer-events-auto shadow-md">
                 <svg className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                 </svg>
              </button>
            </div>

            {/* Typography Content Container */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 flex flex-col items-start md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
              <span className="font-inter text-brand-sky bg-brand-navy/60 px-4 py-1 rounded-full text-[13px] md:text-[14px] font-bold tracking-widest uppercase mb-4 block backdrop-blur-sm border border-brand-sky/20">
                {item.loc}
              </span>
              <h3 className="font-poppins text-white text-[32px] md:text-[48px] font-bold tracking-tight mb-4 drop-shadow-sm">
                {item.title}
              </h3>
              
              <div className="overflow-hidden md:h-0 group-hover:md:h-auto transition-all duration-500 ease-out">
                <p className="font-inter text-white/90 text-[15px] md:text-[18px] max-w-[700px] leading-relaxed opacity-100 md:opacity-0 group-hover:md:opacity-100 transition-opacity duration-500 mt-2">
                  {item.desc}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>
      
    </section>
  );
};

export default Programs;
