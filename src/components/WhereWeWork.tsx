import { useEffect, useRef } from 'react';

const WhereWeWork = () => {
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
    <section className="relative py-24 bg-white flex flex-col items-center" ref={containerRef}>

      <div className="relative z-10 text-center mb-16 fade-in max-w-[600px] px-6">
        <span className="text-brand-navy font-poppins font-bold uppercase tracking-widest text-[13px] mb-4 block inline-flex items-center gap-2 bg-brand-sky-soft px-4 py-1.5 rounded-full">
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

      <div className="relative z-10 w-full max-w-[900px] px-6 fade-in delay-100 flex flex-col gap-6">
        {[
          { loc: "San Pedro, Ambergris Caye", detail: "Holy Cross Anglican School • Island Clinics", date: "Year-Round", icon: "🏥" },
          { loc: "Belize City", detail: "St. John's Primary • Inner-city Outreach", date: "Quarterly", icon: "🏫" },
          { loc: "Orange Walk Town", detail: "Community Center Pavilion • Sugar City", date: "Bi-Annual", icon: "🎪" },
          { loc: "Dangriga & Southern Belize", detail: "Coastal Community Outreach", date: "Annual Mission", icon: "🌴" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col md:flex-row justify-between md:items-center p-6 md:p-8 rounded-[24px] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(34,72,136,0.08)] hover:border-brand-sky/30 transition-all duration-300 group cursor-pointer relative overflow-hidden">
            
            {/* Soft decorative background swell on hover */}
            <div className="absolute top-0 right-0 bottom-0 w-[40%] bg-gradient-to-l from-brand-sky-soft to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex items-start gap-6 relative z-10 w-full md:w-auto">
              {/* Vibrant Icon Box */}
              <div className="w-16 h-16 shrink-0 bg-brand-sky-soft text-brand-navy rounded-[20px] flex items-center justify-center text-3xl group-hover:bg-brand-navy group-hover:text-white transition-colors duration-300 shadow-sm">
                {item.icon}
              </div>
              
              <div className="flex flex-col max-w-[400px]">
                <h3 className="font-poppins text-[22px] font-bold text-brand-navy mb-1 group-hover:text-brand-sky transition-colors">
                  {item.loc}
                </h3>
                <p className="font-inter text-[15px] text-brand-navy/60 m-0 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-6 md:mt-0 relative z-10">
              <span className="font-inter text-[14px] font-bold bg-brand-sky-soft text-brand-navy px-5 py-2.5 rounded-full group-hover:bg-brand-sky group-hover:text-white transition-colors shadow-sm">
                {item.date}
              </span>
              <span className="w-12 h-12 border-2 border-gray-100 rounded-full flex items-center justify-center text-brand-navy/40 group-hover:border-brand-navy group-hover:bg-brand-navy group-hover:text-white transition-all shadow-sm">
                <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </div>
            
          </div>
        ))}
      </div>
      
    </section>
  );
};

export default WhereWeWork;
