// app/settings/page.tsx

'use client'; // ← Ajoute ceci si tu utilises useState/useEffect/etc.

import React from 'react';

export default function SettingsPage() {
  return (
    <main className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Paramètres utilisateur</h1>
      <p>Ici tu pourras modifier tes préférences et ton profil.</p>
    </main>
  );
}
