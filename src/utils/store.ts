export interface PrefStoresInfo {
  name: string;
  stores: StoreInfo[];
}

export interface StoreInfo_ {
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

export interface StoreInfo {
  id: number;
  type: string;
  name: string;
  desc?: string;
  address?: string;
  mapURL?: string;
  country?: string;
  adminlv1?: string;
  adminlv2?: string;
  adminlv3?: string;
  adminlv4?: string;
  adminlv5?: string;
  arcade_amount?: number;
  business_hours_start?: number;
  business_minute_start?: number;
  business_hours_end?: number;
  business_minute_end?: number;
  lng: number;
  lat: number;
  reviewed: boolean;
  is_deleted: boolean;
  create_date: Date;
  update_date: Date;
}

export interface StoreInfoRequest extends StoreInfo {
  is_collection: boolean;
}

export interface ArcadeInfo {
  id: number;
  type: string;
  version_type: string;
  sid: number;
  arcade_amount?: number;
  is_deleted: boolean;
  create_date: Date;
  update_date: Date;
  is_official: boolean;
  reviewed: boolean;
}

export interface CollectionInfo {
  id: number;
  store_id: number;
  uid: number;
  is_deleted: boolean;
  create_date: Date;
  update_date: Date;
}

export interface UpdateStoreRequest {
  id: number;
  business_hours_start?: number;
  business_minute_start?: number;
  business_hours_end?: number;
  business_minute_end?: number;
  arcade_amount?: number;
  desc?: string;
}
