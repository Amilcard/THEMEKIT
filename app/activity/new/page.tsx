// themekit/app/activity/[id]/edit/page.tsx
'use client';
import React from 'react';

interface EditProps {
  params: { id: string }
}

export default function EditActivityPage({ params }: EditProps) {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Modifier l’activité n°{params.id}
      </h1>
      <p>→ Ici, on intégrera bientôt le formulaire d’édition.</p>
    </main>
  );
}
