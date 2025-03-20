import { Button } from '../../components/ui/button';
import { ArrowRight, CheckCircle2, Users, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cta = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Shield, value: '99.9%', label: 'Security Rate' },
    { icon: Clock, value: '< 2min', label: 'Verification Time' },
  ];

  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="section-container">
        <div className="glass p-10 md:p-16 rounded-2xl text-center max-w-4xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in"
          >
            Start Verifying Documents Securely Today
          </h2>
          <p 
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delayed"
          >
            Join thousands of businesses that trust our platform for secure document verification. Get started in minutes.
          </p>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="h-8 w-8 text-primary mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="transition-transform duration-300 hover:scale-105 active:scale-95">
              <Button 
                className="button-primary group" 
                size="lg" 
                onClick={() => navigate('/signup')}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            <div className="transition-transform duration-300 hover:scale-105 active:scale-95">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/contact-sales')}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
