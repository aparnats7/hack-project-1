import { Upload, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

const Step = ({ icon, title, description, number }) => {
  return (
    <div className="relative animate-fade-in opacity-0" style={{ animationFillMode: 'forwards', animationDelay: `${number * 0.2}s` }}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {number < 3 && (
        <div className="hidden md:block absolute top-6 left-6 transform translate-y-12 h-16 w-px border-l border-dashed border-primary/30"></div>
      )}
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload />,
      title: 'Upload Your Document',
      description: 'Simply upload your document in PDF, image, or other supported formats using our intuitive interface.',
      number: 1,
    },
    {
      icon: <Cpu />,
      title: 'AI Analyzes & Verifies',
      description: 'Our advanced AI engine thoroughly analyzes and verifies the authenticity of your document.',
      number: 2,
    },
    {
      icon: <CheckCircle />,
      title: 'Get Verification Result',
      description: 'Receive your verification result instantly, with detailed information about the document\'s authenticity.',
      number: 3,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Our streamlined process makes document verification simple, secure, and efficient.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10 md:space-y-16">
            {steps.map((step) => (
              <Step
                key={step.number}
                icon={step.icon}
                title={step.title}
                description={step.description}
                number={step.number}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="inline-flex items-center gap-2 text-primary font-medium">
            Learn more about our verification process
            <ArrowRight className="h-4 w-4" />
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
