import { Lock, ShieldCheck, FileCheck, BadgeCheck, Shield, UserCheck, CheckCircle2 } from 'lucide-react';

const SecurityCard = ({ icon, title, description }) => {
  return (
    <div className="glass p-6 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Security = () => {
  const securityFeatures = [
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: 'ISO 27001 Certified',
      description: 'Our infrastructure meets the highest international security standards, ensuring comprehensive protection of your sensitive documents.',
    },
    {
      icon: <Shield className="h-8 w-8" />, // ✅ Replaced FileShield with Shield
      title: 'GDPR Compliance',
      description: 'Full compliance with EU data protection regulations, including data minimization, user consent, and right to erasure.',
    },
    {
      icon: <BadgeCheck className="h-8 w-8" />,
      title: 'SOC 2 Type II',
      description: 'Independent verification of our security controls, data protection, and operational excellence.',
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: 'Military-Grade Encryption',
      description: '256-bit AES encryption with perfect forward secrecy ensures your documents remain confidential.',
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: 'Immutable Audit Trail',
      description: 'Blockchain-powered verification records provide tamper-proof documentation of all security events.',
    },
    {
      icon: <UserCheck className="h-8 w-8" />, // ✅ Replaced UserShield with UserCheck
      title: 'Zero Trust Architecture',
      description: 'Continuous verification of user identity and device security with multi-factor authentication.',
    }
  ];

  return (
    <section id="security" className="py-16 md:py-24">
      <div className="section-container">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-secondary/50 text-sm font-medium">
              Enterprise-Grade Security
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Documents Are Protected by Industry-Leading Security
            </h2>
            <p className="text-muted-foreground text-lg">
              We maintain the highest security standards in the industry, with multiple layers of protection and regular third-party audits to ensure your documents remain secure and compliant.
            </p>
            <div className="glass p-4 mt-4 inline-block">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">ISO 27001 Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">SOC 2 Type II</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 grid grid-cols-1 gap-6">
            {securityFeatures.map((feature, index) => (
              <SecurityCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
