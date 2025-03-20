import { Shield, Lock, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const SecurityInfo = () => {
  const securityFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'ISO 27001 Certified',
      description: 'Enterprise-grade security infrastructure with comprehensive controls',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'End-to-End Encryption',
      description: 'Your documents are encrypted at rest and in transit',
      color: 'text-green-500 bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'GDPR Compliant',
      description: 'Full compliance with EU data protection regulations',
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const complianceBadges = [
    {
      name: 'ISO 27001',
      description: 'Information Security Management',
      status: 'active'
    },
    {
      name: 'GDPR',
      description: 'Data Protection Regulation',
      status: 'active'
    },
    {
      name: 'SOC 2 Type II',
      description: 'Security & Privacy Controls',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {securityFeatures.map((feature, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${feature.color} flex items-start gap-3`}
          >
            <div className="mt-1">{feature.icon}</div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Badges */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Compliance & Certifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {complianceBadges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              {badge.status === 'active' ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {badge.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Your Security is Our Priority
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              We use industry-standard encryption and security measures to protect your documents.
              All data is processed in secure, certified data centers with regular security audits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfo; 