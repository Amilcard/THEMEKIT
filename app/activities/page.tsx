'use client';

import React, { useState, useEffect } from 'react';
import activityService, { Activity } from '../../services/activityService';
import ActivityCard from '../../components/ActivityCard';

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityService.getAllActivities()
      .then((data) => setActivities(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement en cours…</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {activities.map((act) => (
        <ActivityCard key={act.id} activity={act} />
      ))}
    </div>
  );
}
