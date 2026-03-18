import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Programs from './components/Programs';
import ImpactStats from './components/ImpactStats';
import Ambassador from './components/Ambassador';
import WhereWeWork from './components/WhereWeWork';
import Testimonials from './components/Testimonials';
import MissionGallery from './components/MissionGallery';
import WhySupport from './components/WhySupport';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Programs />
      <ImpactStats />
      <MissionGallery />
      <Ambassador />
      <WhereWeWork />
      <Testimonials />
      <WhySupport />
      <Footer />
    </>
  );
}

export default App;
