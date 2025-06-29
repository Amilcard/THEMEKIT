// components/Search/FilterPanel.tsx
import React from 'react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: any; // adapte le type si besoin
  onApplyFilters: (filters: any) => void;
}

export default function FilterPanel({ isOpen, onClose, currentFilters, onApplyFilters }: FilterPanelProps) {
  if (!isOpen) return null;
  return (
    <div className="filter-panel-overlay">
      {/* TODO: Colle ici ton ancien code de FilterPanel */}
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}
