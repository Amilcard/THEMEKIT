// components/Common/MultiStepProgressBar.tsx
'use client';

import React from 'react';

interface MultiStepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function MultiStepProgressBar({
  currentStep,
  totalSteps,
}: MultiStepProgressBarProps) {
  const widthPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div
        className="bg-blue-600 h-2 rounded-full transition-width duration-300"
        style={{ width: `${widthPercent}%` }}
      />
      <p className="text-sm text-gray-600 mt-1">
        Étape {currentStep} / {totalSteps}
      </p>
    </div>
  );
}
