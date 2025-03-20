import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, CheckCircle, Cpu, Database, FileText, Users, Clock, Play } from 'lucide-react';
import VideoPlayer from '../components/ui/video-player';

const LearnMore = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Advanced Security',
      description: 'Military-grade encryption and blockchain technology ensure your documents are protected with the highest level of security.',
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'AI-Powered Verification',
      description: 'Our advanced AI algorithms analyze documents in real-time, detecting tampering and verifying authenticity with high accuracy.',
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Blockchain Integration',
      description: 'Every verification is recorded on the blockchain, creating an immutable audit trail of document authenticity.',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Multiple Document Types',
      description: 'Support for various document formats including PDFs, images, and scanned documents with OCR capabilities.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Built-in collaboration tools allow your team to work together efficiently on document verification tasks.',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Real-time Processing',
      description: 'Get instant verification results with our high-performance processing system.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Learn More About Our Solution
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in-up">
              Discover how our AI-powered document verification system can transform your business processes.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass p-6 rounded-xl animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Watch Our Demo</h2>
              <p className="text-muted-foreground">
                See how our document verification system works in action
              </p>
            </div>
            
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-muted">
              <VideoPlayer
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                poster="https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
                title="Document Verification Demo"
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Want to see more? Schedule a personalized demo with our team
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/schedule-demo')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Schedule a Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/contact-sales')}
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Experience the power of secure document verification with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="button-primary"
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/contact-sales')}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMore; 