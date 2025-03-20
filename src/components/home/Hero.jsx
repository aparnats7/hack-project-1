import { Button } from '../../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AiWorkflowDiagram from './AiWorkflowDiagram';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              AI-Powered Secure Document Verification
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in-delayed">
              Verify documents instantly with advanced AI technology. Our platform ensures security, accuracy, and compliance in every verification process.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Button className="button-primary group" size="lg" onClick={() => navigate('/signup')}>
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/learn-more')}>
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative lg:pl-4">
            <div className="glass p-8 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
              <AiWorkflowDiagram />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
