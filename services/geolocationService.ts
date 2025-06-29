export interface AppGeolocationCoordinates {
  latitude: number;
  longitude: number;
}

export class GeolocationError extends Error {}

export default {
  async getCurrentPosition(): Promise<AppGeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new GeolocationError('Géolocalisation non supportée'));
      }
      navigator.geolocation.getCurrentPosition(
        pos => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }),
        err => reject(new GeolocationError(err.message))
      );
    });
  }
};