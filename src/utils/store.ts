export interface PrefStoresInfo {
  name: string;
  stores: StoreInfo[];
}

export interface StoreInfo {
  name: string;
  address: string;
  mapURL: string;
  lat: number;
  lng: number;
  type: string;
  adminlv1: string;
  adminlv2: string;
  adminlv3: string;
  adminlv4: string;
  adminlv5: string;
  arcade_amount: number;
  business_hours_start: number;
  business_minute_start: number;
  business_hours_end: number;
  business_minute_end: number;
}
