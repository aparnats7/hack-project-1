import { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Security from '../components/home/Security';
import Cta from '../components/home/Cta';

const Index = () => {
  useEffect(() => {
    // Add animation to elements when they come into view
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        // If the element is in view
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          // Set opacity directly on the HTMLElement
          if (entry.target instanceof HTMLElement) {
            entry.target.style.opacity = '1';
          }
          // Unobserve after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all elements with the "feature-card" class
    document.querySelectorAll('.feature-card, .security-card').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Security />
        <Cta />
      </main>
      <Footer />
    </div>
  );
};

export default Index; 