import { Button } from '../../components/ui/button';
import { ArrowRight, CheckCircle2, Users, Shield, Clock, Lock, FileCheck, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cta = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Shield, value: '99.99%', label: 'Security Uptime' },
    { icon: BadgeCheck, value: 'ISO 27001', label: 'Certified' },
    { icon: FileCheck, value: 'GDPR', label: 'Compliant' },  // ✅ Fixed FileShield to FileCheck
    { icon: Lock, value: '256-bit', label: 'AES Encryption' },
    { icon: Clock, value: '< 2min', label: 'Verification Time' },
    { icon: CheckCircle2, value: 'SOC 2', label: 'Type II' }
  ];

  return (
    <section className="py-16 md:py-24 bg-primary/5">
      <div className="section-container">
        <div className="glass p-10 md:p-16 rounded-2xl text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Trusted by Global Enterprises for Secure Document Verification
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delayed">
            Join thousands of businesses that trust our enterprise-grade security and compliance standards. Our platform ensures your documents are protected with the highest level of security available.
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
            <Button 
              className="button-primary" 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Start Secure Verification
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/contact-sales')}
            >
              Schedule Security Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
