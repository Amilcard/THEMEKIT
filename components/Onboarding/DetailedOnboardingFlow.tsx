import React from 'react';

interface Props {
  isVisible?: boolean;
  onComplete: () => void;
}

export default function DetailedOnboardingFlow({ isVisible = false, onComplete }: Props) {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Bienvenue !</h2>
        <p className="mb-6">Découvre comment utiliser InKlusif Flooow étape par étape.</p>
        <button
          onClick={onComplete}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Terminer le tutoriel
        </button>
      </div>
    </div>
  );
}
