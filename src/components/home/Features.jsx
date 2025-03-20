import { Brain, Shield, FileText, Clock, Users, Lock, CheckCircle2, ShieldCheck } from 'lucide-react';

const Feature = ({ icon, title, description }) => {
  return (
    <div className="feature-card animate-zoom-in opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.1s' }}>
      <div className="feature-icon">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Shield />,
      title: 'ISO 27001 Security',
      description: 'Enterprise-grade security infrastructure with comprehensive controls and regular third-party audits.',
    },
    {
      icon: <ShieldCheck />,  // Fixed: Changed FileShield to ShieldCheck
      title: 'GDPR Compliance',
      description: 'Full compliance with EU data protection regulations, including data minimization and user rights.',
    },
    {
      icon: <CheckCircle2 />,
      title: 'SOC 2 Type II',
      description: 'Independent verification of security controls, data protection, and operational excellence.',
    },
    {
      icon: <Lock />,
      title: 'Zero Trust Security',
      description: 'Continuous verification of user identity and device security with multi-factor authentication.',
    },
    {
      icon: <FileText />,
      title: 'Secure Document Handling',
      description: 'End-to-end encryption and secure storage for all document types with tamper-proof verification.',
    },
    {
      icon: <Clock />,
      title: 'Real-Time Security',
      description: 'Continuous monitoring and instant threat detection with automated security responses.',
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="section-title">Enterprise-Grade Security & Compliance</h2>
          <p className="section-subtitle">
            Our platform combines cutting-edge security technology with comprehensive compliance standards to ensure your documents are protected with the highest level of security available.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
