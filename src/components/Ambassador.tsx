import { useEffect, useRef } from 'react';

const actionPhotos = [
  { img: 'ambassador-examining-child.jpg', caption: 'Fluoride clinic at Holy Cross Anglican School' },
  { img: 'ambassador-kids-group-yellow.jpg', caption: 'Adventure Minds Summer Camp, San Pedro' },
  { img: 'ambassador-coloring-activity.jpg', caption: 'Dental hygiene education workshop' },
  { img: 'ambassador-mask-dental-model.jpg', caption: 'Teaching proper brushing techniques' },
];

const Ambassador = () => {
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
    <section id="ambassador" className="relative py-24 md:py-32 bg-white overflow-hidden" ref={containerRef}>

      {/* Soft background accent */}
      <div className="absolute top-[15%] right-[-8%] w-[45%] h-[500px] bg-brand-sky-soft rounded-full blur-[80px] opacity-50 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6">

        {/* Two-column: Photo + Bio */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center fade-in">

          {/* Left — Portrait */}
          <div className="w-full lg:w-[45%] shrink-0">
            <div className="relative">
              <div className="rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(34,72,136,0.12)]">
                <img
                  src="/images/ambassador-crown-waving.jpg"
                  alt="Faith Edgar — Miss World Belize 2025"
                  className="w-full h-[480px] md:h-[560px] object-cover object-top"
                  loading="lazy"
                />
              </div>
              {/* Floating credential badge */}
              <div className="absolute -bottom-6 left-6 bg-white rounded-2xl px-6 py-4 shadow-[0_12px_32px_rgba(34,72,136,0.1)] border border-brand-sky-light/30">
                <span className="font-poppins text-[14px] font-bold text-brand-navy block">Miss World Belize 2025</span>
                <span className="font-inter text-[13px] text-brand-sky font-semibold">Beauty With a Purpose</span>
              </div>
            </div>
          </div>

          {/* Right — Story */}
          <div className="w-full lg:w-[55%] pt-4">
            <span className="text-brand-sky font-poppins font-bold uppercase tracking-widest text-[12px] mb-3 block">Founder & Ambassador</span>

            <h2 className="font-poppins text-[40px] md:text-[52px] font-black text-brand-navy tracking-tight leading-[1.1] mb-8">
              Meet <span className="text-brand-sky">Faith Edgar</span>
            </h2>

            <div className="space-y-5 font-inter text-[16px] md:text-[17px] text-brand-navy/70 leading-relaxed">
              <p>
                Faith Edgar is Miss World Belize 2025 and the founder of <strong className="text-brand-navy">Smiles for Belize</strong> — her Beauty With a Purpose project dedicated to bringing dental care and oral health education to children across the country.
              </p>
              <p>
                In Belize, access to dental care is limited — especially in schools and rural communities. Faith saw a gap and built a mission around it: partnering with organizations like the Belize Mission Project to host fluoride clinics, deliver toothbrush giveaways, and teach children proper brushing techniques at schools like Holy Cross Anglican in San Pedro.
              </p>
              <p>
                From summer camps to school benches, Faith shows up where it matters. Her work isn't just about fixing teeth — it's about empowering children with the knowledge and confidence that a healthy smile can transform how they eat, speak, and see themselves.
              </p>
            </div>

            {/* Pull quote */}
            <blockquote className="mt-10 pl-6 border-l-4 border-brand-sky">
              <p className="font-poppins text-[18px] md:text-[20px] text-brand-navy font-semibold italic leading-[1.5]">
                "A healthy smile can transform a child's life. Together, we are nurturing healthier, happier children — one smile at a time."
              </p>
            </blockquote>
          </div>
        </div>

        {/* Action Photos Strip */}
        <div className="mt-20 fade-in delay-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actionPhotos.map((photo, i) => (
              <div key={i} className="group relative rounded-[20px] overflow-hidden shadow-sm h-[200px] md:h-[240px]">
                <img
                  src={`/images/${photo.img}`}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute bottom-0 left-0 w-full px-4 py-3 font-inter text-[12px] text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  {photo.caption}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Ambassador;
