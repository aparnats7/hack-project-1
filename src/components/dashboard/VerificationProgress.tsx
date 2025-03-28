import {
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';

interface Step {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'current' | 'upcoming';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface VerificationProgressProps {
  currentStep: number;
  steps: Step[];
}

const VerificationProgress: React.FC<VerificationProgressProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Verification Progress
      </h2>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            className="h-full bg-blue-600"
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'complete'
                    ? 'bg-blue-600 text-white'
                    : step.status === 'current'
                    ? 'bg-white border-2 border-blue-600 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.status === 'complete' ? (
                  <CheckCircleIcon className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    step.status === 'complete'
                      ? 'text-blue-600'
                      : step.status === 'current'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default VerificationProgress; 