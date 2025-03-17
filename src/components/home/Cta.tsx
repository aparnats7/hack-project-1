
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Cta = () => {
  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="section-container">
        <div className="glass p-10 md:p-16 rounded-2xl text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Verifying Documents Securely Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust our platform for secure document verification. Get started in minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="button-primary" size="lg">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
