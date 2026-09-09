import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: 'delivery' | 'payment' | 'confirmation';
}

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({ currentStep }) => {
  const steps = [
    { id: 'cart', label: 'Cart', status: 'completed' },
    {
      id: 'delivery',
      label: 'Delivery',
      status: currentStep === 'delivery' ? 'current' : 'completed',
    },
    {
      id: 'payment',
      label: 'Payment',
      status:
        currentStep === 'payment'
          ? 'current'
          : currentStep === 'confirmation'
          ? 'completed'
          : 'upcoming',
    },
    {
      id: 'confirmation',
      label: 'Done',
      status: currentStep === 'confirmation' ? 'current' : 'upcoming',
    },
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-4 mb-2">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-gray-200 z-0" />

        {steps.map((step, idx) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-[#34A853] text-white'
                    : isCurrent
                    ? 'bg-[#1A73E8] text-white ring-4 ring-blue-100'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`mt-1.5 text-[11px] sm:text-xs font-semibold ${
                  isCurrent
                    ? 'text-[#1A73E8]'
                    : isCompleted
                    ? 'text-gray-800'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
