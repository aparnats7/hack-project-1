import { useState } from 'react';
import { Upload, Cpu, CheckCircle, ArrowRight, FileText, Shield, Database, X, Play, ChevronDown, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const Step = ({ icon, title, description, number, isLast }) => {
  return (
    <div className="relative animate-fade-in opacity-0" style={{ animationFillMode: 'forwards', animationDelay: `${number * 0.2}s` }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {!isLast && (
        <div className="absolute top-12 left-6 transform translate-y-12 h-16 w-px border-l border-dashed border-primary/30"></div>
      )}
    </div>
  );
};

const VerticalFlowchart = ({ steps }) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="glass p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute top-full left-6 transform translate-y-4 h-8 w-px border-l border-dashed border-primary/30"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Upload Your Document',
      description: 'Simply upload your document in PDF, image, or other supported formats using our intuitive interface.',
      number: 1,
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Document Processing',
      description: 'Our system processes and extracts key information from your document for verification.',
      number: 2,
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'AI Analysis',
      description: 'Advanced AI algorithms analyze document authenticity and detect potential tampering.',
      number: 3,
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security Verification',
      description: 'Blockchain technology verifies document integrity and creates an immutable record.',
      number: 4,
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Result Delivery',
      description: 'Receive your verification result with detailed authenticity information.',
      number: 5,
    },
  ];

  const handlePlayDemo = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 100);
  };

  const handleResetDemo = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentStep(0);
  };

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-secondary/30">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Our streamlined process makes document verification simple, secure, and efficient.
          </p>
        </div>

        {/* Vertical Flowchart */}
        <div className="mb-16">
          <VerticalFlowchart steps={steps} />
        </div>
        
        <div className="mt-16 text-center">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 text-primary font-medium"
            onClick={() => setShowModal(true)}
          >
            Learn more about our verification process
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Detailed Information Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Document Verification Process</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <span>Advanced AI-powered document analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <span>Blockchain-based verification system</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <span>Real-time verification results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <span>Multi-document format support</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security Measures</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-primary mt-0.5" />
                      <span>End-to-end encryption</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-primary mt-0.5" />
                      <span>Immutable verification records</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-primary mt-0.5" />
                      <span>Secure document storage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="demo" className="space-y-6">
              <div className="aspect-video bg-secondary/20 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-primary" />
                      ) : (
                        <Play className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div className="space-y-4">
                      <Button size="lg" className="gap-2" onClick={handlePlayDemo}>
                        {isPlaying ? 'Pause Demo' : 'Watch Demo Video'}
                      </Button>
                      <Button variant="outline" size="lg" className="gap-2" onClick={handleResetDemo}>
                        <RefreshCw className="w-4 h-4" />
                        Reset Demo
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
                  <div 
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Real-time Verification Example</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Document Authenticity</span>
                      <span className={`${currentStep >= 3 ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {currentStep >= 3 ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Digital Signature</span>
                      <span className={`${currentStep >= 4 ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {currentStep >= 4 ? 'Valid' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Content Integrity</span>
                      <span className={`${currentStep >= 5 ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {currentStep >= 5 ? 'Intact' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="glass p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Verification Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing Time</span>
                      <span>{currentStep * 0.5}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence Score</span>
                      <span>{Math.min(100, currentStep * 20)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Verification Method</span>
                      <span>{currentStep >= 3 ? 'AI + Blockchain' : 'Initializing...'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">AI Technology Stack</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Cpu className="w-5 h-5 text-primary mt-0.5" />
                      <span>Deep Learning Models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Cpu className="w-5 h-5 text-primary mt-0.5" />
                      <span>OCR Technology</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Cpu className="w-5 h-5 text-primary mt-0.5" />
                      <span>Pattern Recognition</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security Infrastructure</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Database className="w-5 h-5 text-primary mt-0.5" />
                      <span>Distributed Ledger</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Database className="w-5 h-5 text-primary mt-0.5" />
                      <span>Hash Verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Database className="w-5 h-5 text-primary mt-0.5" />
                      <span>Immutable Records</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HowItWorks;
