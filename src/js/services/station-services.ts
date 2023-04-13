export type BikeServiceResponse<T> = {
  data: {
    stations: T[];
  };
  last_updated: number;
  ttl: number;
  version: string;
};

export type Station = {
  station_id: string;
  name: string;
  address: string;
  rental_uris: {
    android: string;
    ios: string;
  };
  lat: number;
  lon: number;
  capacity: number;
};

export async function getStations(): Promise<BikeServiceResponse<Station>> {
  const response = await fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json');

  if (!response.ok) {
    throw new Error('Could not retrieve stations');
  }

  return response.json();
}

export type Availability = {
  station_id: string;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  last_reported: number;
  num_bikes_available: number;
  num_docks_available: number;
  vehicle_types_available: AvailabilityType[];
};

export type AvailabilityType = {
  vehicle_type_id: string;
  count: number;
};

export async function getAvailability(): Promise<BikeServiceResponse<Availability>> {
  const response = await fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json');

  if (!response.ok) {
    throw new Error('Could not retrieve availability');
  }

  return response.json();
}

export type CompleteStationData = Station & Availability;

export async function getCompleteStationData(): Promise<CompleteStationData[]> {
  const stationsResponse = await getStations();
  const availibilityResponse = await getAvailability();

  return mergeStationData(stationsResponse.data.stations, availibilityResponse.data.stations);
}

function mergeStationData(stations: Station[], availibility: Availability[]) {
  const stationsMap = new Map<string, Station | Availability>();

  stations.forEach((station) => stationsMap.set(station.station_id, station));

  availibility.forEach((station) => {
    stationsMap.set(station.station_id, {
      ...stationsMap.get(station.station_id),
      ...station,
    });
  });

  return (Array.from(stationsMap.values()) as CompleteStationData[]).sort((a, b) => (a.name > b.name ? 1 : -1));
}
