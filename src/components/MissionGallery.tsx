const topRow = [
  'ambassador-examining-child.jpg',
  'kids-smiling-classroom.jpg',
  'ambassador-goggles-treating.jpg',
  'students-brushing-uniforms.jpg',
  'ambassador-crown-community.jpg',
  'screening-child-outdoor.jpg',
  'ambassador-coloring-activity.jpg',
  'clinic-wide.jpg',
  'ambassador-kids-group-yellow.jpg',
  'dental-care-bw.jpg',
  'ambassador-serving-community.jpg',
  'kids-brushing-outside.jpg',
  'ambassador-cafeteria-gloves.jpg',
  'ambassador-kids-steps.jpg',
  'screening-child-closeup.jpg',
  'ambassador-dental-work.jpg',
  'volunteers-talking-students.jpg',
];

const bottomRow = [
  'ambassador-treating-patient.jpg',
  'kids-classroom-waiting.jpg',
  'ambassador-scrubs-prep.jpg',
  'child-brushing-closeup.jpg',
  'ambassador-community-crowd.jpg',
  'dental-instruments-detail.jpg',
  'ambassador-kids-school-bench.jpg',
  'student-fluoride-treatment.jpg',
  'ambassador-closeup-warm.jpg',
  'kids-peace-sign-classroom.jpg',
  'ambassador-mask-dental-model.jpg',
  'dental-procedure-closeup.jpg',
  'ambassador-laughing-casual.jpg',
  'ambassador-parade-float.jpg',
  'ambassador-crown-waving.jpg',
  'ambassador-hair-flip.jpg',
  'dental-drilling-detail.jpg',
];

const MissionGallery = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">

      {/* Quote */}
      <div className="max-w-[780px] mx-auto text-center px-6 mb-20">
        <div className="w-16 h-16 mx-auto mb-8 bg-brand-sky-soft rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-sky" viewBox="0 0 100 120" fill="currentColor">
            <path d="M30,10 C10,10 5,35 15,55 C20,70 25,100 30,115 C33,108 38,80 40,65 C42,55 45,50 50,50 C55,50 58,55 60,65 C62,80 67,108 70,115 C75,100 80,70 85,55 C95,35 90,10 70,10 C60,12 55,18 50,18 C45,18 40,12 30,10Z"/>
          </svg>
        </div>
        <blockquote className="font-poppins text-[22px] md:text-[28px] text-brand-navy leading-[1.5] tracking-tight mb-8 italic">
          "Every child deserves to smile without pain. When we arrive in a community, we're not just fixing teeth — we're restoring confidence, dignity, and hope. That's what Smiles for Belize is all about."
        </blockquote>
        <p className="font-inter text-[16px] text-brand-navy/70 font-semibold">
          — Faith Edgar, <span className="text-brand-sky">Miss World Belize 2025</span>
        </p>
      </div>

      {/* Top Row — scrolls left */}
      <div className="mb-5 overflow-hidden">
        <div className="flex gap-5 animate-marquee-left w-max hover:[animation-play-state:paused]">
          {[...topRow, ...topRow].map((photo, i) => (
            <div key={i} className="w-[280px] h-[200px] shrink-0 rounded-2xl overflow-hidden border-2 border-brand-sky-light/60 shadow-sm">
              <img
                src={`/images/${photo}`}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row — scrolls right */}
      <div className="overflow-hidden">
        <div className="flex gap-5 animate-marquee-right w-max hover:[animation-play-state:paused]">
          {[...bottomRow, ...bottomRow].map((photo, i) => (
            <div key={i} className="w-[280px] h-[200px] shrink-0 rounded-2xl overflow-hidden border-2 border-brand-sky-light/60 shadow-sm">
              <img
                src={`/images/${photo}`}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default MissionGallery;
