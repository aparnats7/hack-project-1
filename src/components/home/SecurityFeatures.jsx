import { Shield, Lock, FileCheck, Users, CheckCircle2, BadgeCheck, ShieldCheck, FileShield, UserShield } from 'lucide-react';

const SecurityFeatures = () => {
  const securityLayers = [
    {
      icon: ShieldCheck,
      title: "Enterprise-Grade Security",
      description: "ISO 27001 certified security infrastructure with end-to-end encryption",
      badge: "ISO 27001",
      color: "from-blue-500/20 to-blue-600/10"
    },
    {
      icon: FileShield,
      title: "Data Protection",
      description: "GDPR compliant data handling with advanced encryption protocols",
      badge: "GDPR",
      color: "from-green-500/20 to-green-600/10"
    },
    {
      icon: BadgeCheck,
      title: "Compliance & Audit",
      description: "SOC 2 Type II certified with regular security audits",
      badge: "SOC 2",
      color: "from-purple-500/20 to-purple-600/10"
    },
    {
      icon: UserShield,
      title: "Access Control",
      description: "Role-based access control with multi-factor authentication",
      badge: "RBAC",
      color: "from-orange-500/20 to-orange-600/10"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
            Your Documents Are Safe With Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-delayed">
            We employ industry-leading security measures to ensure that your documents remain confidential, secure, and protected at all times.
          </p>
        </div>

        {/* Security Layers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityLayers.map((layer, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${layer.color} rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300`} />
              <div className="relative p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 animate-fade-in-up hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/0 rounded-lg blur-sm" />
                    <div className="relative p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                      <layer.icon className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="text-sm font-medium px-3 py-1 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/10">
                    {layer.badge}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{layer.title}</h3>
                <p className="text-muted-foreground">{layer.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Process Flow */}
        <div className="mt-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl blur-xl" />
            <div className="relative p-8 rounded-xl bg-card border border-border/50">
              <h3 className="text-2xl font-bold mb-6 text-center">Document Security Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { 
                    step: "1", 
                    title: "Upload", 
                    desc: "Secure document upload with encryption",
                    icon: FileCheck
                  },
                  { 
                    step: "2", 
                    title: "Process", 
                    desc: "Automated security verification",
                    icon: Shield
                  },
                  { 
                    step: "3", 
                    title: "Store", 
                    desc: "Encrypted storage with backup",
                    icon: Lock
                  },
                  { 
                    step: "4", 
                    title: "Access", 
                    desc: "Secure access with audit logs",
                    icon: Users
                  }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 group">
                    <div className="relative mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-sm" />
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="text-primary font-bold">{item.step}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityFeatures; 