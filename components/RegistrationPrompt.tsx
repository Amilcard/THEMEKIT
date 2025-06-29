'use client';

import React from 'react';

interface RegistrationPromptProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubscribe: () => void;
  loading: boolean;
  message: string | null;
  onClose: () => void;
}

export default function RegistrationPrompt({
  email,
  onEmailChange,
  onSubscribe,
  loading,
  message,
  onClose
}: RegistrationPromptProps) {
  return (
    <div>
      {/* ton UI d’invitation */}
      <button onClick={onSubscribe} disabled={loading}>
        {loading ? '…En cours' : 'M’abonner'}
      </button>
      {message && <p>{message}</p>}
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}
