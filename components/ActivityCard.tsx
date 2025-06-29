// components/ActivityCard.tsx
import React from 'react';

export interface Activity {
  id: string;
  title: string;
  description: string;
}

interface Props {
  activity: Activity;
}

export default function ActivityCard({ activity }: Props) {
  return (
    <div className="border rounded p-4 shadow-sm">
      <h3 className="font-bold text-lg">{activity.title}</h3>
      <p className="text-gray-600">{activity.description}</p>
    </div>
  );
}
