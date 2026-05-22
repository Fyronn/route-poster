export type Vehicle = {
  vehicleId: number;
  transportCompanyId?: number | null;
  plateNumber?: string | null;
  capacity: number;
  brandModel?: string | null;
  productionYear?: number | null;
  vehicleType?: string | null;
  equipmentFeatures?: string | null;
  isActive?: boolean | null;
};

export type VehicleUpdateDto = {
  plateNumber?:string,
  capacity?:number,
  brandModel?:string,
  productionYear?:number,
  vehicleType?:string,
  equipmentFeatures?:string,
  isActive?:boolean
}
