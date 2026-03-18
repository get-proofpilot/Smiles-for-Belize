import { useState, useEffect, useRef, useCallback } from 'react';

const slides = [
  {
    img: 'ambassador-examining-child.jpg',
    headline: '1,200 Children Treated with Comprehensive Care',
    desc: 'From routine cleanings to emergency extractions, we provide free dental care to children who would otherwise go without.',
  },
  {
    img: 'kids-smiling-classroom.jpg',
    headline: '15 Schools Reached Across Belize',
    desc: 'Our mobile clinics visit primary schools for screenings, fluoride treatments, and oral hygiene education.',
  },
  {
    img: 'volunteers-talking-students.jpg',
    headline: '50+ Volunteer Dentists and Counting',
    desc: 'Expert dental professionals from around the world donate their time and skills to transform lives.',
  },
];

const ImpactStats = () => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(advance, 5000);
    return () => clearInterval(timerRef.current);
  }, [advance]);

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

  const goToSlide = (i: number) => {
    setCurrent(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 5000);
  };

  return (
    <section id="impact" className="relative py-24 bg-dental-bg flex flex-col items-center overflow-hidden" ref={containerRef}>

      {/* Headline left, paragraph right */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto mb-16 px-6 fade-in flex flex-col md:flex-row justify-between items-start gap-8">
        <h2 className="text-[40px] md:text-[56px] font-poppins font-black text-brand-navy tracking-tight leading-[1.1] shrink-0">
          We're Making a <br/>
          <span className="text-brand-sky bg-brand-sky-soft px-4 py-1 rounded-xl">Difference</span>
        </h2>
        <p className="font-inter text-[16px] md:text-[18px] text-brand-navy/70 leading-relaxed max-w-[450px] md:pt-4">
          Smiles for Belize transforms lives by providing free, comprehensive dental care to underserved communities. We foster oral health and community well-being, creating a brighter future for thousands of children.
        </p>
      </div>

      {/* Bento Grid — 60/40 split */}
      <div className="relative z-10 max-w-[1100px] w-full mx-auto px-6 fade-in delay-200 flex flex-col gap-6">

        {/* Top row: slideshow + right cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">

          {/* Large Slideshow Card — spans both right-side rows */}
          <div className="md:row-span-2 relative rounded-[28px] overflow-hidden shadow-sm group cursor-pointer min-h-[420px] md:min-h-[480px]"
            onClick={advance}
          >
            {slides.map((slide, i) => (
              <img
                key={i}
                src={`/images/${slide.img}`}
                alt={slide.headline}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent"></div>

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
              <h3 className="font-poppins text-[22px] md:text-[26px] font-bold text-white leading-[1.3] tracking-tight mb-3 max-w-[480px]">
                {slides[current].headline}
              </h3>
              <p className="font-inter text-[14px] text-white/70 leading-relaxed max-w-[440px] mb-6">
                {slides[current].desc}
              </p>

              {/* Progress bars */}
              <div className="flex gap-2.5 max-w-[240px]">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
                    className="flex-1 h-[4px] rounded-full bg-white/30 overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full bg-white transition-all duration-300"
                      style={{ width: i === current ? '100%' : i < current ? '100%' : '0%', opacity: i <= current ? 1 : 0.3 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stat Card — top right */}
          <div className="rounded-[28px] bg-white border border-brand-sky-light/30 p-7 flex flex-col shadow-sm relative overflow-hidden min-h-[220px]">
            <div className="w-11 h-11 bg-brand-sky-soft rounded-xl flex items-center justify-center mb-auto">
              <svg className="w-5 h-5 text-brand-sky" viewBox="0 0 100 120" fill="currentColor">
                <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
              </svg>
            </div>
            <h3 className="font-poppins text-[44px] font-black text-brand-navy leading-none tracking-tighter mb-1">
              1,200+
            </h3>
            <span className="font-inter text-[14px] text-brand-navy/50">
              Children treated with comprehensive care.
            </span>
          </div>

          {/* Photo Card — bottom right */}
          <div className="rounded-[28px] overflow-hidden shadow-sm relative min-h-[220px]">
            <img
              src="/images/ambassador-crown-community.jpg"
              alt="Faith Edgar with community"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* CTA Card — full width */}
        <div className="rounded-[28px] bg-brand-navy p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          {/* Background watermark */}
          <svg className="absolute right-[4%] top-[50%] -translate-y-1/2 w-[180px] h-[220px] opacity-[0.06] rotate-12" viewBox="0 0 100 120" fill="white">
            <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
          </svg>

          <div className="relative z-10 max-w-[520px]">
            <h3 className="font-poppins text-[24px] md:text-[30px] font-bold text-white leading-[1.3] tracking-tight mb-2">
              100% of Donations Go Directly to Care
            </h3>
            <p className="font-inter text-[15px] text-white/60 leading-relaxed">
              Every dollar you give supports dental supplies, travel to remote communities, and hands-on treatment for children and families who need it most.
            </p>
          </div>

          <a href="#donate" className="relative z-10 shrink-0 inline-flex items-center gap-3 h-[52px] px-7 rounded-full bg-white text-brand-navy font-poppins font-bold text-[14px] hover:-translate-y-1 transition-transform shadow-sm">
            Donate Now
            <span className="w-7 h-7 bg-brand-sky-soft rounded-full flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>
        </div>

      </div>

    </section>
  );
};

export default ImpactStats;
