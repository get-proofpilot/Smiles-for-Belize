import { useState } from 'react';

const Hero = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen brand-bg-gradient flex items-center pt-28 pb-20 overflow-hidden">

      <div className="relative z-20 max-w-[1240px] mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* Left — Text & CTAs */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          <h1 className="font-poppins text-[48px] md:text-[64px] lg:text-[80px] font-black text-brand-navy leading-[1.08] tracking-tight mb-6 animate-fade-in-up">
            Bringing Dental Care<br/>
            to Every <span className="text-brand-sky relative">
              Community
              <svg className="absolute -bottom-2 left-0 w-full h-4 text-brand-navy" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M0,15 Q50,0 200,10" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="font-inter text-lg md:text-xl text-brand-navy/70 leading-relaxed max-w-[540px] mb-10 animate-fade-in-up delay-100 mt-2">
            Oral health is essential health. Through free clinics, school visits, and community partnerships, we're making dental care accessible to every Belizean — regardless of income or location.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-200">
            <a href="#impact" className="inline-flex items-center gap-3 h-[56px] px-8 rounded-full bg-brand-navy text-white font-poppins font-bold text-[15px] shadow-[0_12px_24px_rgba(34,72,136,0.2)] hover:-translate-y-1 transition-transform">
              See Our Impact
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-navy">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
            <a href="#programs" className="inline-flex items-center gap-2 h-[56px] px-8 rounded-full bg-white/70 text-brand-navy font-poppins font-semibold text-[15px] border border-brand-sky-light hover:bg-white hover:-translate-y-1 transition-all">
              See Our Programs
            </a>
          </div>
        </div>

        {/* Right — Video Player */}
        <div className="w-full sm:w-[360px] lg:w-[420px] h-[500px] sm:h-[550px] lg:h-[650px] animate-scale-in delay-300 group cursor-pointer shrink-0">
          <div className="w-full h-full rounded-[40px] overflow-hidden shadow-[0_40px_80px_rgba(34,72,136,0.15)] relative bg-white border-[8px] border-white">
            {!isPlaying ? (
              <div
                className="absolute inset-0 group cursor-pointer"
                onClick={() => setIsPlaying(true)}
              >
                <img
                  src="/images/smiles_video_poster.png"
                  alt="Play Video"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/5 transition-colors"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-transform duration-500 group-hover:scale-110 text-brand-navy">
                     <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z" />
                     </svg>
                  </div>
                </div>
              </div>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              >
                <source src="/videos/smiles-intro-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
