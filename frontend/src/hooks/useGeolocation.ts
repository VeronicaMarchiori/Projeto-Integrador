
interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function useGeolocation() {
  const location: Coordinates = {
    latitude: -23.550520,
    longitude: -46.633308,
    accuracy: 0,
  };

  const error = null;
  const isLoading = false;
  const permissionStatus = 'granted' as const;

  const getCurrentLocation = () => {

    return Promise.resolve(location);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Retorna sempre 0 - função legacy mantida para compatibilidade, vai ser implementada a questão da geolocalização no futuro.
    return 0;
  };

  return {
    location,
    error,
    isLoading,
    permissionStatus,
    getCurrentLocation,
    calculateDistance,
  };
}
