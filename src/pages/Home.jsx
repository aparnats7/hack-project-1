import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Cta from '../components/home/Cta';
import SecurityFeatures from '../components/home/SecurityFeatures';

const Home = () => {
  return (
    <main>
      <Hero />
      <Features />
      <SecurityFeatures />
      <Cta />
    </main>
  );
};

export default Home; 