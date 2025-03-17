
import { Lock, ShieldCheck, FileCheck } from 'lucide-react';

interface SecurityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SecurityCard = ({ icon, title, description }: SecurityCardProps) => {
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
      icon: <Lock className="h-8 w-8" />,
      title: 'End-to-End Encryption',
      description: 'All your documents are encrypted from the moment they\'re uploaded until they\'re verified.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: 'Blockchain Technology',
      description: 'Immutable record-keeping ensures the integrity of verification results.',
    },
    {
      icon: <FileCheck className="h-8 w-8" />,
      title: 'Compliance Standards',
      description: 'Our platform adheres to GDPR, ISO 27001, and other international security standards.',
    },
  ];

  return (
    <section id="security" className="py-16 md:py-24">
      <div className="section-container">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-secondary/50 text-sm font-medium">
              Your Security Is Our Priority
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Your Documents Are Safe With Us
            </h2>
            <p className="text-muted-foreground text-lg">
              We employ industry-leading security measures to ensure that your documents remain confidential, secure, and protected at all times.
            </p>
            <div className="glass p-4 mt-4 inline-block">
              <div className="flex space-x-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" alt="ISO 27001" className="h-10" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/38/GDPR_logo.svg" alt="GDPR" className="h-10" />
                <div className="flex items-center text-primary font-medium">
                  <Lock className="h-4 w-4 mr-1" /> SOC 2
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
