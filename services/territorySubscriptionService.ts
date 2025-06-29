// themekit/services/territorySubscriptionService.ts

export interface TerritorySubscriptionResponse {
  message: string;
}

export default {
  async subscribe(email: string, territory: string): Promise<TerritorySubscriptionResponse> {
    // TODO : remplacer par un vrai appel API
    console.log(`Abonnement de ${email} pour ${territory}`);
    return { message: 'Merci ! Nous vous informerons lorsque votre territoire sera couvert.' };
  }
};
