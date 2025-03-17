
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollTop = window.scrollY;
      const parallaxElement = heroRef.current.querySelector('.parallax-bg');
      if (parallaxElement) {
        // Slow down the parallax effect for subtlety
        (parallaxElement as HTMLElement).style.transform = `translateY(${scrollTop * 0.15}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background with subtle parallax */}
      <div className="absolute inset-0 z-0 parallax-bg opacity-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-400 rounded-full filter blur-[120px]"></div>
      </div>
      
      <div className="section-container relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6 animate-fade-in">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-secondary/50 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Secure AI Technology
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            AI-Powered <span className="text-primary">Secure</span> Document Verification
          </h1>
          <p className="text-xl text-muted-foreground">
            Ensure the authenticity of your documents using AI & Blockchain-powered verification. Fast, secure, and hassle-free.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="button-primary">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="button-secondary">
              Try Demo
            </Button>
          </div>
          <div className="flex items-center space-x-4 pt-6 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-background">
                  <span className="font-medium text-xs">{i}k+</span>
                </div>
              ))}
            </div>
            <span>Trusted by thousands of businesses worldwide</span>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <div className="relative">
            <div className="glass p-6 rounded-2xl shadow-xl animate-float w-80 h-80 flex items-center justify-center">
              <ShieldCheck className="w-24 h-24 text-primary" />
              <div className="absolute -bottom-4 -right-4 glass p-4 rounded-xl animate-slide-up animation-delay-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 glass p-4 rounded-xl animate-slide-up animation-delay-300">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
