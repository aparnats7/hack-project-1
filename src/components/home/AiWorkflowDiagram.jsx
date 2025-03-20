import { Shield, Lock, FileCheck, Brain, CheckCircle2, Activity } from 'lucide-react';

const AiWorkflowDiagram = () => {
  const securityLayers = [
    {
      icon: Shield,
      title: "AI Shield",
      description: "Advanced protection layer",
      color: "from-blue-500/20 to-blue-600/10",
      features: ["Neural network defense", "Real-time monitoring"]
    },
    {
      icon: Lock,
      title: "Encryption",
      description: "Secure data handling",
      color: "from-purple-500/20 to-purple-600/10",
      features: ["End-to-end encryption", "Secure protocols"]
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Intelligent processing",
      color: "from-green-500/20 to-green-600/10",
      features: ["Pattern recognition", "Fraud detection"]
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[800px]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-3xl" />
      
      {/* 3D Shield Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[400px] h-[500px]">
          {/* Shield Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl transform rotate-6" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl transform -rotate-6" />
          
          {/* Shield Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/0 rounded-full blur-xl" />
              <div className="relative p-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                <Shield className="h-16 w-16 text-primary animate-pulse" />
              </div>
            </div>
            
            {/* Security Layers */}
            <div className="space-y-6 w-full">
              {securityLayers.map((layer, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${layer.color} rounded-xl blur-lg group-hover:blur-xl transition-all duration-300`} />
                  <div className="relative p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in-up hover:shadow-lg hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/0 rounded-lg blur-sm" />
                        <div className="relative p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                          <layer.icon className="h-6 w-6 text-primary animate-pulse" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{layer.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{layer.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {layer.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded-full">
                              <Activity className="h-3 w-3 text-primary/50" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animated Security Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[500px] h-[600px]">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-primary/10 rounded-full animate-ping"
              style={{
                animationDelay: `${i * 0.5}s`,
                transform: `scale(${1 + i * 0.1})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiWorkflowDiagram; 