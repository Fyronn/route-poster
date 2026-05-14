export type CorporateEmployee = {
  userId?: number | null;
  employeeId?: number | null;
  clientId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  addressTitle?: string | null;
  addressDetail?: string | null;
  city?: string | null;
  district?: string | null;
  neighborhood?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  workShift?: string | null;
  isActive?: boolean | null;
  
  // UI Specific optional fields
  email?: string | null;
  department?: string;
  preferredStop?: string;
};
