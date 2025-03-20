import { HelpCircle, MessageSquare, BookOpen, Mail, Phone } from 'lucide-react';

const UserSupport = () => {
  const faqs = [
    {
      question: 'What documents can I verify?',
      answer: 'We support various identity documents including passports, driver\'s licenses, national IDs, and other government-issued documents.'
    },
    {
      question: 'How long does verification take?',
      answer: 'Most verifications are completed within 24-48 hours. You\'ll receive a notification once your document is verified.'
    },
    {
      question: 'Is my document data secure?',
      answer: 'Yes, we use end-to-end encryption and follow strict security protocols. Your documents are processed in secure, certified data centers.'
    }
  ];

  const supportOptions = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: 'Email Support',
      description: 'support@veritrustai.com',
      action: 'Send Email'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      action: 'Call Now'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Help */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Help
          </h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportOptions.map((option, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                {option.icon}
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {option.title}
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {option.description}
            </p>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              {option.action} →
            </button>
          </div>
        ))}
      </div>

      {/* Documentation Link */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              Need More Help?
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Check our comprehensive documentation for detailed guides and tutorials.
            </p>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-2">
              View Documentation →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSupport; 