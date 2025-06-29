'use client';
import React from 'react';

export default function ProfilePage() {
  return (
    <main className="max-w-screen-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profil utilisateur</h1>
      <p className="text-gray-700">
        Ici s’affichera le profil de l’utilisateur.
      </p>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Détails du profil</h2>
        <ul className="list-disc list-inside">
          <li>Nom: Jean Dupont</li>
          <li>Email: jean.dupont@example.com</li>
          <li>Téléphone: 0123456789</li>
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Actions</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
          Modifier le profil
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">
          Supprimer le compte
        </button>
      </div>
    </main>
  );
}