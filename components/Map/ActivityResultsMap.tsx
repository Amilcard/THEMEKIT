'use client';
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Activity } from '../../services/activityService';

interface Props {
  activities: Activity[];
  // centre de la carte sous la forme [latitude, longitude]
  center?: [number, number];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function ActivityResultsMap({ activities, center }: Props) {
  return (
    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
      {/* Ici tu pourras intégrer ta librairie de carte (Leaflet, Google Maps…) */}
      <p className="text-gray-500">
        Carte (à implémenter) — {activities.length} activités à afficher.
      </p>
    </div>
  );
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-lg w-full"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
