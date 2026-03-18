const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10 relative overflow-hidden">
      
      {/* Soft gradient wash at the top edge */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-sky/30 to-transparent"></div>

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-3 font-poppins font-bold text-xl text-brand-sky mb-6 group">
              <div className="relative">
                {/* Sparkles matching logo */}
                <svg className="absolute -top-1 -left-2 w-4 h-4 text-brand-sky animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>
                </svg>
                <svg className="absolute -bottom-1 -right-2 w-3 h-3 text-brand-sky animate-pulse delay-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>
                </svg>
                {/* Official Smiling Tooth Logo rendered in White for dark background */}
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-white group-hover:scale-105 transition-transform" fill="currentColor">
                  <path d="M18.8 4.2c-1.4-1.4-3.5-1.6-5.1-.4-.6.5-1.1 1.2-1.7 1.2s-1.1-.7-1.7-1.2c-1.6-1.2-3.7-1-5.1.4-1.6 1.6-1.5 4.3-.2 6.3 1.1 1.6 2.3 3.6 2.6 6.3.1 1 .5 1.5 1 1.8.6.3 1.2.3 1.8-.1.4-.3.7-1 .8-1.9.1-.8.2-1.6.4-1.6s.4.8.4 1.6c.1.9.4 1.6.7 1.9.6.4 1.3.4 1.9.1.5-.3.9-.9 1-1.8.3-2.7 1.5-4.7 2.6-6.3 1.3-2 1.4-4.7-.2-6.3zm-3.3 5.4c-1.5 1.5-5.5 1.5-7 0-.4-.4-.4-1.1 0-1.5s1.1-.4 1.5 0c1 .9 3 .9 4 0 .4-.4 1.1-.4 1.5 0 .5.4.5 1.1 0 1.5z"/>
                </svg>
              </div>
              <div className="flex flex-col tracking-tight leading-none uppercase">
                <span className="text-[18px] text-brand-sky">Smiles</span>
                <span className="text-[18px] text-brand-sky">For Belize</span>
              </div>
            </a>
            <p className="font-inter text-[15px] text-white/70 leading-relaxed mb-6 max-w-[280px]">
              Committed to providing premium, compassionate dental care and preventative education to underserved communities.
            </p>
          </div>

          <div>
            <h4 className="font-poppins font-bold text-[18px] text-white mb-6">Explore</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#programs" className="font-inter text-[15px] text-white/70 hover:text-brand-sky transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-brand-sky opacity-0 group-hover:opacity-100 transition-opacity"></span> Programs</a></li>
              <li><a href="#impact" className="font-inter text-[15px] text-white/70 hover:text-brand-sky transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-brand-sky opacity-0 group-hover:opacity-100 transition-opacity"></span> Our Impact</a></li>
              <li><a href="#ambassador" className="font-inter text-[15px] text-white/70 hover:text-brand-sky transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-brand-sky opacity-0 group-hover:opacity-100 transition-opacity"></span> Volunteer Ambassadors</a></li>
              <li><a href="#community" className="font-inter text-[15px] text-white/70 hover:text-brand-sky transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-brand-sky opacity-0 group-hover:opacity-100 transition-opacity"></span> Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-bold text-[18px] text-white mb-6">Contact</h4>
            <ul className="flex flex-col gap-4">
              <li className="font-inter text-[15px] text-white/70 flex gap-3"><span className="text-brand-sky">✉</span> info@smilesforbelize.org</li>
              <li className="font-inter text-[15px] text-white/70 flex gap-3"><span className="text-brand-sky">☏</span> +1 (555) 123-4567</li>
              <li className="font-inter text-[15px] text-white/70 flex gap-3"><span className="text-brand-sky">📍</span> San Pedro, Belize</li>
            </ul>
          </div>

          <div>
            <h4 className="font-poppins font-bold text-[18px] text-white mb-6">Legal</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="font-inter text-[15px] text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="font-inter text-[15px] text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="font-inter text-[15px] text-white/70 hover:text-white transition-colors">Tax Exempt 501(c)(3)</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between border-t border-white/10 gap-4">
          <p className="font-inter text-[14px] text-white/50 m-0">
            &copy; {new Date().getFullYear()} Smiles for Belize. All rights reserved.
          </p>
          <div className="flex gap-4">
             {/* Social mockups */}
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-sky flex items-center justify-center text-white transition-colors"><span className="sr-only">Facebook</span>FB</a>
             <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-sky flex items-center justify-center text-white transition-colors"><span className="sr-only">Instagram</span>IG</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
