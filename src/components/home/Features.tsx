
import { Brain, Shield, FileText, Clock, Users } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
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
      icon: <Brain />,
      title: 'AI-Powered Verification',
      description: 'Uses machine learning & OCR to analyze documents with unparalleled accuracy.',
    },
    {
      icon: <Shield />,
      title: 'Blockchain Security',
      description: 'Tamper-proof storage & verification using advanced blockchain technology.',
    },
    {
      icon: <FileText />,
      title: 'Multi-Document Support',
      description: 'Supports PDFs, images, government IDs, and various document formats.',
    },
    {
      icon: <Clock />,
      title: 'Real-Time Verification',
      description: 'Instant results with advanced fraud detection capabilities.',
    },
    {
      icon: <Users />,
      title: 'User-Friendly Interface',
      description: 'Simple, fast, and accessible interface designed for all users.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="section-title">Unmatched Features</h2>
          <p className="section-subtitle">
            Our platform combines cutting-edge technology with intuitive design to provide the most secure and efficient document verification available.
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
