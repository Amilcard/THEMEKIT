'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function ActivityPage() {
  const { id } = useParams();
  return (
    <main className="max-w-screen-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Détail de l’activité</h1>
      <p className="text-gray-700">
        Tu regardes l’activité n° <strong>{id}</strong>.
      </p>
    </main>
  );
}