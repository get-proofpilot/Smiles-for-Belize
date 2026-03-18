import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 md:py-4 transition-all duration-300 flex items-center justify-between ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
      <a href="#" className="flex items-center gap-3 font-poppins font-bold text-xl text-brand-sky group">
        <div className="relative">
          {/* Sparkles matching logo */}
          <svg className="absolute -top-1 -left-2 w-4 h-4 text-brand-sky animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>
          </svg>
          <svg className="absolute -bottom-1 -right-2 w-3 h-3 text-brand-sky animate-pulse delay-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>
          </svg>
          {/* Official Smiling Tooth Logo */}
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-brand-navy group-hover:scale-105 transition-transform" fill="currentColor">
            <path d="M18.8 4.2c-1.4-1.4-3.5-1.6-5.1-.4-.6.5-1.1 1.2-1.7 1.2s-1.1-.7-1.7-1.2c-1.6-1.2-3.7-1-5.1.4-1.6 1.6-1.5 4.3-.2 6.3 1.1 1.6 2.3 3.6 2.6 6.3.1 1 .5 1.5 1 1.8.6.3 1.2.3 1.8-.1.4-.3.7-1 .8-1.9.1-.8.2-1.6.4-1.6s.4.8.4 1.6c.1.9.4 1.6.7 1.9.6.4 1.3.4 1.9.1.5-.3.9-.9 1-1.8.3-2.7 1.5-4.7 2.6-6.3 1.3-2 1.4-4.7-.2-6.3zm-3.3 5.4c-1.5 1.5-5.5 1.5-7 0-.4-.4-.4-1.1 0-1.5s1.1-.4 1.5 0c1 .9 3 .9 4 0 .4-.4 1.1-.4 1.5 0 .5.4.5 1.1 0 1.5z"/>
          </svg>
        </div>
        <div className="flex flex-col tracking-tight leading-none uppercase">
          <span className="text-[16px] text-brand-sky">Smiles</span>
          <span className="text-[16px] text-brand-sky">For Belize</span>
        </div>
      </a>
      
      <ul className={`md:flex items-center gap-8 list-none ${menuOpen ? 'fixed inset-0 bg-white flex-col justify-center gap-8 pt-10 px-6 display-flex text-xl' : 'hidden md:flex'}`}>
        {menuOpen && (
           <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 text-brand-navy text-4xl leading-none">&times;</button>
        )}
        <li><a href="#programs" onClick={() => setMenuOpen(false)} className={`font-inter font-medium text-[15px] transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-brand-sky after:transition-all hover:after:w-full ${scrolled || menuOpen ? 'text-brand-navy hover:text-brand-sky' : 'text-brand-navy hover:text-brand-sky'}`}>Programs</a></li>
        <li><a href="#impact" onClick={() => setMenuOpen(false)} className={`font-inter font-medium text-[15px] transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-brand-sky after:transition-all hover:after:w-full ${scrolled || menuOpen ? 'text-brand-navy hover:text-brand-sky' : 'text-brand-navy hover:text-brand-sky'}`}>Impact</a></li>
        <li><a href="#ambassador" onClick={() => setMenuOpen(false)} className={`font-inter font-medium text-[15px] transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-brand-sky after:transition-all hover:after:w-full ${scrolled || menuOpen ? 'text-brand-navy hover:text-brand-sky' : 'text-brand-navy hover:text-brand-sky'}`}>Ambassador</a></li>
        <li><a href="#community" onClick={() => setMenuOpen(false)} className={`font-inter font-medium text-[15px] transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-brand-sky after:transition-all hover:after:w-full ${scrolled || menuOpen ? 'text-brand-navy hover:text-brand-sky' : 'text-brand-navy hover:text-brand-sky'}`}>Community</a></li>
        <li><a href="#donate" onClick={() => setMenuOpen(false)} className="btn btn-primary h-[44px] px-6 text-[14px]">Donate</a></li>
      </ul>

      {!menuOpen && (
        <div className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer z-50" onClick={() => setMenuOpen(true)}>
          <span className="w-6 h-0.5 transition-all bg-brand-navy"></span>
          <span className="w-6 h-0.5 transition-all bg-brand-navy"></span>
          <span className="w-6 h-0.5 transition-all bg-brand-navy"></span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
