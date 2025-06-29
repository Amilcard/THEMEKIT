// app/register/page.tsx
'use client';

import React from 'react';
import RegisterForm from '@/components/Auth/RegisterForm';
import MultiStepProgressBar from '@/components/Common/MultiStepProgressBar';

export default function RegisterPage() {
  const pageContainerStyle: React.CSSProperties = {
    maxWidth: '450px',
    margin: '2rem auto',
    padding: '2rem',
  };
  const titleStyle: React.CSSProperties = {
    textAlign: 'center',
    color: 'var(--color-blue-primary, #0055A4)',
    marginBottom: '24px',
    fontFamily: 'var(--font-primary, Montserrat)',
  };

  return (
    <div style={pageContainerStyle}>
      <MultiStepProgressBar currentStep={1} totalSteps={2} />
      <h1 style={titleStyle}>Créer votre compte</h1>
      <RegisterForm />
    </div>
  );
}
