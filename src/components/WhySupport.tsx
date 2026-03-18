const reasons = [
  {
    num: '01',
    title: 'Real, lasting impact',
    icon: (
      <svg className="w-10 h-10 text-brand-sky" viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
      </svg>
    ),
    desc: 'Every mission trip delivers hundreds of dental procedures — cleanings, fillings, extractions — to children and families who have never seen a dentist.',
  },
  {
    num: '02',
    title: 'Supplies, education & access',
    icon: (
      <svg className="w-10 h-10 text-brand-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <path d="M12 6v7"/><path d="M9 10l3 3 3-3"/>
      </svg>
    ),
    desc: 'Your support provides toothbrushes, dental kits, and professional-grade equipment to communities that have never had access — plus oral hygiene education that lasts a lifetime.',
  },
  {
    num: '03',
    title: 'Community-driven care',
    icon: (
      <svg className="w-10 h-10 text-brand-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    desc: 'We partner with local schools, churches, and health workers so our programs continue long after the mission team leaves. Education is as important as treatment.',
  },
];

const WhySupport = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">

      <div className="max-w-[1100px] mx-auto px-6">

        {/* Headline */}
        <h2 className="font-poppins text-[40px] md:text-[52px] font-black text-brand-navy tracking-tight text-center mb-12 leading-[1.1]">
          Why Support <span className="text-brand-sky">Smiles for Belize</span>?
        </h2>

        {/* Wide Image */}
        <div className="relative rounded-[32px] overflow-hidden mb-[-80px] md:mb-[-100px] z-0">
          <img
            src="/images/ambassador-kids-school-bench.jpg"
            alt="Smiles for Belize community outreach"
            className="w-full h-[320px] md:h-[440px] object-cover object-top"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80"></div>
        </div>

        {/* Reason Cards — overlapping the image */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          {reasons.map((r) => (
            <div
              key={r.num}
              className="bg-white border border-brand-sky-light/40 rounded-[24px] p-8 shadow-[0_12px_40px_rgba(34,72,136,0.08)] hover:shadow-[0_20px_50px_rgba(34,72,136,0.12)] transition-shadow"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-poppins text-[20px] font-bold text-brand-navy leading-[1.3] max-w-[180px]">
                  {r.title}
                </h3>
                <span className="shrink-0 w-9 h-9 rounded-full bg-brand-sky flex items-center justify-center font-poppins text-[13px] font-bold text-white">
                  {r.num}
                </span>
              </div>

              <div className="mb-6">
                {r.icon}
              </div>

              <p className="font-inter text-[14px] text-brand-navy/60 leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhySupport;
