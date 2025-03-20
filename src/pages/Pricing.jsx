import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Starter',
      price: '₹8,245',
      period: 'month',
      description: 'Perfect for small businesses getting started with document verification.',
      features: [
        'Up to 1,000 verifications/month',
        'Basic AI verification',
        'Email support',
        'Standard security',
        'Basic analytics',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '₹24,890',
      period: 'month',
      description: 'Ideal for growing businesses with advanced verification needs.',
      features: [
        'Up to 10,000 verifications/month',
        'Advanced AI verification',
        'Priority email & phone support',
        'Enhanced security features',
        'Advanced analytics',
        'API access',
        'Custom branding',
      ],
      cta: 'Get Started',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'month',
      description: 'Tailored solutions for large organizations with complex requirements.',
      features: [
        'Unlimited verifications',
        'Custom AI models',
        '24/7 dedicated support',
        'Enterprise-grade security',
        'Custom analytics',
        'Full API access',
        'White-label solution',
        'SLA guarantee',
        'Dedicated account manager',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const handlePlanSelection = async (plan) => {
    setLoading(true);
    try {
      if (plan.name === 'Enterprise') {
        navigate('/contact-sales');
      } else {
        // Add analytics tracking here if needed
        navigate('/signup', { state: { selectedPlan: plan.name } });
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      toast({
        title: 'Error',
        description: 'Unable to process your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans include our core document verification features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass p-8 rounded-2xl relative ${
                plan.popular ? 'border-2 border-primary' : ''
              } hover:shadow-lg transition-shadow duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                <div className="text-4xl font-bold mb-2">
                  {plan.price}
                  <span className="text-lg text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular ? 'button-primary' : 'button-secondary'
                }`}
                onClick={() => handlePlanSelection(plan)}
                disabled={loading}
              >
                {loading ? 'Processing...' : plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-muted-foreground mb-6">
            We offer custom pricing for organizations with specific requirements.
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/contact-sales')}
            disabled={loading}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 