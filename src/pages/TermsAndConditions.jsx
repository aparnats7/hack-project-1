import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to SecureAI. By accessing and using our document verification platform, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>"Platform" refers to the SecureAI document verification service</li>
              <li>"User" refers to any individual or entity using our Platform</li>
              <li>"Service" refers to the document verification services provided by SecureAI</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className="mb-4">
              Users of our Platform agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of their account credentials</li>
              <li>Use the Platform in compliance with applicable laws</li>
              <li>Not attempt to circumvent our security measures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Privacy and Data Protection</h2>
            <p>
              We take your privacy seriously. Our data collection and processing practices are governed by our Privacy Policy. By using our Platform, you consent to the collection and use of information as described in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Platform, including but not limited to text, graphics, logos, and software, are the exclusive property of SecureAI and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p>
              SecureAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes via email or through the Platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p>
              For any questions regarding these Terms and Conditions, please contact us at support@secureai.com
            </p>
          </section>
        </div>

        <div className="mt-12 flex justify-center">
          <Button onClick={() => navigate('/signup')} className="button-primary">
            Back to Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 