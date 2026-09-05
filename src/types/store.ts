export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  is24h?: boolean;
}
