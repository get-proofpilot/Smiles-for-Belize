import { useEffect, useRef } from 'react';

const Testimonials = () => {
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
    <section id="community" className="relative py-24 md:py-32 bg-brand-sky-soft flex flex-col items-center overflow-hidden" ref={containerRef}>

      {/* Subtle SVG sparkle decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="absolute left-[12%] bottom-[20%] w-[30px] h-[30px] opacity-[0.10]" viewBox="0 0 24 24" fill="var(--color-brand-sky)">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"/>
        </svg>
        <svg className="absolute right-[18%] top-[12%] w-[20px] h-[20px] opacity-[0.08]" viewBox="0 0 24 24" fill="var(--color-brand-navy)">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"/>
        </svg>
        <svg className="absolute right-[8%] bottom-[30%] w-[16px] h-[16px] opacity-[0.06]" viewBox="0 0 24 24" fill="var(--color-brand-sky)">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z"/>
        </svg>
      </div>

      <div className="relative z-10 text-center mb-16 fade-in px-6">
        <span className="text-brand-navy font-poppins font-bold uppercase tracking-widest text-[13px] mb-4 block inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-sky animate-pulse"></span>
          Testimonials
        </span>
        <h2 className="font-poppins text-[48px] text-brand-navy tracking-tight relative inline-block">
          What <span className="text-brand-sky">People Say</span>
        </h2>
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in delay-100">
        {[
          {
            name: "Mr. Lopez",
            loc: "Orange Walk, BZ",
            img: "volunteers-talking-students.jpg",
            text: "Having dental professionals come directly to our school is a game-changer. Many of our students had never seen a dentist before.",
            delay: ""
          },
          {
            name: "Isabella Martinez",
            loc: "San Pedro, BZ",
            img: "ambassador-goggles-treating.jpg",
            text: "The clinic team was so gentle with my children. They explained everything carefully and made the whole experience completely stress-free.",
            delay: "delay-100"
          },
          {
            name: "Principal Garcia",
            loc: "Belize City, BZ",
            img: "students-brushing-uniforms.jpg",
            text: "The brushing workshop empowered our kids. Providing free toothbrushes and paste meant they could practice what they learned immediately at home.",
            delay: "delay-200"
          }
        ].map((testimonial, idx) => (
          <div key={idx} className={`bg-white rounded-[32px] p-8 md:p-10 shadow-[0_20px_40px_rgba(34,72,136,0.06)] hover:shadow-[0_30px_60px_rgba(34,72,136,0.12)] transition-shadow duration-300 flex flex-col h-full border border-brand-sky-soft relative ${testimonial.delay}`}>
            
            {/* Brand Sky Star Rating */}
            <div className="flex gap-1 mb-6">
              {[1,2,3,4,5].map(i => (
                 <svg key={i} className="w-5 h-5 text-brand-sky" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                 </svg>
              ))}
            </div>

            <p className="font-inter text-[16px] text-brand-navy/70 leading-relaxed mb-10 flex-grow">
              "{testimonial.text}"
            </p>

            {/* Client Identity Block */}
            <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-brand-sky-light border-2 border-white shadow-sm">
                <img src={`/images/${testimonial.img}`} alt={testimonial.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex flex-col">
                <span className="font-poppins text-[16px] font-bold text-brand-navy leading-tight">
                  {testimonial.name}
                </span>
                <span className="font-inter text-[13px] text-brand-sky font-medium mt-1">
                  {testimonial.loc}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>
      
    </section>
  );
};

export default Testimonials;
