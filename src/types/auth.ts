import { WaterbodyType } from './pollution';

export type UserRole = 'user' | 'ngo';

export interface BaseAccount {
  id: string;
  role: UserRole;
  createdAt: string;
}

export interface UserProfile extends BaseAccount {
  role: 'user';
  fullName: string;
  email: string;
  bio?: string;
  phoneNumber?: string;
  location?: string;
  avatarUrl?: string;
  volunteerPoints?: number;
}

export type NgoType = 
  | 'Marine Conservation NGO'
  | 'River Basin Alliance'
  | 'Coastal Cleanup Non-Profit'
  | 'Environmental Research & Science'
  | 'Youth Climate Action Network'
  | 'Community Ocean Stewardship';

export interface NgoProfile extends BaseAccount {
  role: 'ngo';
  orgName: string;
  orgType: NgoType | string;
  officialEmail: string;
  contactPerson: string;
  contactNumber: string;
  operatingLocation: string;
  accreditationId: string;
  verificationStatus: 'verified' | 'pending_verification';
  missionStatement?: string;
  website?: string;
  logoUrl?: string;
}

export type AuthUser = UserProfile | NgoProfile;

export interface CleanupDrive {
  id: string;
  orgId: string;
  orgName: string;
  orgType: string;
  title: string;
  description: string;
  locationName: string;
  waterbodyType: WaterbodyType;
  coordinates: [number, number];
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  targetVolunteers: number;
  registeredVolunteers: string[]; // list of user emails or IDs
  equipmentProvided: string[];
  contactEmail: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  imageUrl?: string;
}
