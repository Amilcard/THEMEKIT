export interface Activity {
  id: string;
  title: string;
  description: string;
}

export default {
  async getAllActivities(): Promise<Activity[]> {
    // TODO : remplacer par un vrai appel API
    return [
      { id: '1', title: 'Football', description: 'Match de foot pour enfants' },
      { id: '2', title: 'Atelier Peinture', description: 'Peinture créative' },
      { id: '3', title: 'Danse Moderne', description: 'Danse pour adolescents' },
      { id: '4', title: 'Théâtre', description: 'Initiation au théâtre' },
      { id: '5', title: 'Piscine', description: 'Séance de natation' },
      { id: '6', title: 'Escalade', description: 'Mur d’escalade débutant' },
      { id: '7', title: 'Musique', description: 'Cours de guitare' },
      { id: '8', title: 'Lecture', description: 'Club de lecture' },
      { id: '9', title: 'Coding', description: 'Atelier de code' },
      { id: '10', title: 'Cuisine', description: 'Atelier de cuisine' },
    ];
  }
};