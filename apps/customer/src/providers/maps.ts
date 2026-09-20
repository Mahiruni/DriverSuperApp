export type Coordinates = { latitude: number; longitude: number };
export type RouteEstimate = { distanceM: number; durationS: number };

export interface MapsProvider {
  estimateRoute(from: Coordinates, to: Coordinates): Promise<RouteEstimate>;
}

export class MapboxMapsProvider implements MapsProvider {
  async estimateRoute(from: Coordinates, to: Coordinates): Promise<RouteEstimate> {
    const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) throw new Error('Mapbox access token is not configured');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=false&access_token=${encodeURIComponent(token)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Unable to calculate route');
    const data = await response.json() as { routes?: Array<{ distance: number; duration: number }> };
    const route = data.routes?.[0];
    if (!route) throw new Error('No route found');
    return { distanceM: Math.round(route.distance), durationS: Math.round(route.duration) };
  }
}
