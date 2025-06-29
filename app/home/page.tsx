// app/home/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Services (chemins relatifs)
import activityService, { Activity } from '../../services/activityService';
import geolocationService, { AppGeolocationCoordinates } from '../../services/geolocationService';
import territorySubscriptionService from '../../services/territorySubscriptionService';

// Composants
import DetailedOnboardingFlow from '../../components/Onboarding/DetailedOnboardingFlow';
import ActivityCard from '../../components/ActivityCard';
import TerritoryBanner from '../../components/TerritoryBanner';
import RegistrationPrompt from '../../components/RegistrationPrompt';
import LogoPlaceholder from '../../components/Icons/LogoPlaceholder';
import Modal from '../../components/Common/Modal';

interface TerritoryStatus {
  isCovered: boolean;
  territoryName: string;
  message: string;
  iconBadge?: '!' | '?';
}

export default function HomePage() {
  // État
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [displayed, setDisplayed] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [territoryStatus, setTerritoryStatus] = useState<TerritoryStatus | null>(null);
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<string | null>(null);
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);

  // Effets au montage
  useEffect(() => {
    // 1️⃣ Onboarding
    if (localStorage.getItem('hasSeenOnboarding') !== 'true') {
      setShowOnboarding(true);
    }

    // 2️⃣ Activités
    activityService.getAllActivities()
      .then(data => {
        setAllActivities(data);
        setDisplayed(data.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoadingActivities(false));

    // 3️⃣ Géolocalisation
    geolocationService.getCurrentPosition()
      .then((pos: AppGeolocationCoordinates) => {
        const covered =
          pos.latitude >= 40 &&
          pos.latitude <= 50 &&
          pos.longitude >= 0 &&
          pos.longitude <= 10;
        setTerritoryStatus({
          isCovered: covered,
          territoryName: covered ? 'Territoire couvert' : 'Hors couverture',
          message: covered
            ? "Bienvenue ! Toutes les fonctionnalités sont disponibles."
            : "Votre zone n'est pas encore couverte. Inscrivez-vous pour être notifié.",
          iconBadge: covered ? undefined : '!'
        });
      })
      .catch(() => {
        setTerritoryStatus({
          isCovered: false,
          territoryName: 'Localisation inconnue',
          message: "Impossible de vous localiser. Vous pouvez vous abonner pour être informé.",
          iconBadge: '?'
        });
      });

    // 4️⃣ Invitation à l’inscription
    const timer = setTimeout(() => {
      if (!localStorage.getItem('hasSeenRegistrationPrompt')) {
        setShowRegistrationPrompt(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleSubscribeTerritory = () => {
    if (!territoryStatus) return;
    setIsSubscribing(true);
    territorySubscriptionService
      .subscribe(subscriptionEmail, territoryStatus.territoryName)
      .then(() => {
        setSubscriptionMessage('Merci pour votre inscription !');
        setTerritoryStatus(prev => prev ? { ...prev, isCovered: true } : prev);
        localStorage.setItem('hasSeenRegistrationPrompt', 'true');
      })
      .catch(() => {
        setSubscriptionMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      })
      .finally(() => {
        setIsSubscribing(false);
        setTimeout(() => setSubscriptionMessage(null), 5000);
      });
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleCloseRegistrationPrompt = () => {
    setShowRegistrationPrompt(false);
    localStorage.setItem('hasSeenRegistrationPrompt', 'true');
  };

  // Rendu
  return (
    <>
      {/* Onboarding en modal */}
      <Modal isOpen={showOnboarding} onClose={handleCloseOnboarding}>
        <DetailedOnboardingFlow onClose={handleCloseOnboarding} />
      </Modal>

      {/* Abonnement territoire en modal */}
      <Modal isOpen={showRegistrationPrompt} onClose={handleCloseRegistrationPrompt}>
        <RegistrationPrompt
          email={subscriptionEmail}
          onEmailChange={setSubscriptionEmail}
          onSubscribe={handleSubscribeTerritory}
          loading={isSubscribing}
          message={subscriptionMessage}
          onClose={handleCloseRegistrationPrompt}
        />
      </Modal>

      {/* Contenu principal */}
      <div className="relative">
        {territoryStatus && (
          <TerritoryBanner
            {...territoryStatus}
            onSubscribe={handleSubscribeTerritory}
            loading={isSubscribing}
            message={subscriptionMessage}
          />
        )}

        <div className="flex flex-col items-center py-10">
          <LogoPlaceholder className="h-20 w-auto animate-bounce" />
          <h1 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Découvrez les activités près de chez vous
          </h1>
        </div>

        <div className="mx-auto max-w-4xl px-4">
          {loadingActivities ? (
            <p>Chargement des activités…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map(act => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          )}
        </div>

        <div className="my-8 flex justify-center">
          <button
            onClick={() => setDisplayed(allActivities)}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Voir toutes les activités
          </button>
        </div>
      </div>
    </>
  );
}
