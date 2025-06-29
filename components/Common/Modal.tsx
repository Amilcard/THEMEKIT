// components/Common/Modal.tsx
'use client';

import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        {children}
      </div>
    </div>
  );
}
