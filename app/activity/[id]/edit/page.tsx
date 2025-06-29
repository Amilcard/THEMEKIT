'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function EditActivityPage() {
  const { id } = useParams();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Modifier l’activité n°{id}
      </h1>
      <p>→ Ici, on intégrera bientôt le formulaire d’édition.</p>
    </main>
  );
}