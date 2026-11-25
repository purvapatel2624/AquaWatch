import { UserProfile, NgoProfile, CleanupDrive } from '../types/auth';

export interface StoredAuthAccount {
  profile: UserProfile | NgoProfile;
  passwordHash: string; // Plaintext or simulated hash for demo testing
}

export const DEMO_USER_ACCOUNT: UserProfile = {
  id: 'user-elena-01',
  role: 'user',
  fullName: 'Elena Rostova',
  email: 'elena.citizen@aquawatch.org',
  bio: 'Coastal conservation volunteer & citizen scientist documenting driftline macroplastics.',
  phoneNumber: '+1 (555) 748-2910',
  location: 'Santa Monica, California',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  volunteerPoints: 340,
  createdAt: '2024-01-15T08:00:00Z',
};

export const DEMO_NGO_ACCOUNT: NgoProfile = {
  id: 'ngo-ocean-guardians-01',
  role: 'ngo',
  orgName: 'Pacific Ocean Cleanup Alliance',
  orgType: 'Marine Conservation NGO',
  officialEmail: 'coordinator@pacificcleanup.org',
  contactPerson: 'Dr. Marcus Vance',
  contactNumber: '+1 (555) 382-9011',
  operatingLocation: 'California Coast & Pacific Rim',
  accreditationId: 'UN-EP-NGO-8842',
  verificationStatus: 'verified',
  missionStatement: 'Dedicated to eradicating macroplastics and abandoned ghost nets across coastal wetlands and estuaries through rigorous scientific community monitoring and rapid cleanup action.',
  website: 'https://pacificcleanup.org',
  logoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&auto=format&fit=crop&q=80',
  createdAt: '2023-09-10T12:00:00Z',
};

export const INITIAL_CLEANUP_DRIVES: CleanupDrive[] = [
  {
    id: 'drive-101',
    orgId: 'ngo-ocean-guardians-01',
    orgName: 'Pacific Ocean Cleanup Alliance',
    orgType: 'Marine Conservation NGO',
    title: 'Santa Monica Beach Driftline Sweep',
    description: 'Mobilizing community volunteers to clear microplastics, bottle caps, and single-use food packaging across 1.8km of high-tide coastal driftline.',
    locationName: 'Santa Monica Pier Shingle & Strand',
    waterbodyType: 'beach',
    coordinates: [34.0102, -118.4965],
    date: '2026-11-15',
    time: '09:00',
    targetVolunteers: 60,
    registeredVolunteers: ['elena.citizen@aquawatch.org', 'citizen.volunteer@gmail.com'],
    equipmentProvided: [
      'Heavy-duty puncture-resistant gloves',
      'Biodegradable debris collection sacks',
      'Stainless steel litter pickers',
      'Digital field scales & audit tally sheets'
    ],
    contactEmail: 'coordinator@pacificcleanup.org',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'drive-102',
    orgId: 'ngo-ocean-guardians-01',
    orgName: 'Pacific Ocean Cleanup Alliance',
    orgType: 'Marine Conservation NGO',
    title: 'Ballona Creek Estuary Plastic Interception',
    description: 'Targeted retrieval of floating polyethylene film packaging, beverage containers, and urban runoff debris trapped in coastal salt marshes.',
    locationName: 'Ballona Creek Ecological Reserve',
    waterbodyType: 'estuary',
    coordinates: [33.9625, -118.4418],
    date: '2026-11-28',
    time: '10:00',
    targetVolunteers: 45,
    registeredVolunteers: ['elena.citizen@aquawatch.org'],
    equipmentProvided: [
      'Waterproof hip waders',
      'High-visibility safety vests',
      'Debris skimmer nets',
      'Microplastic sampling sieves'
    ],
    contactEmail: 'coordinator@pacificcleanup.org',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'drive-103',
    orgId: 'ngo-ocean-guardians-01',
    orgName: 'Pacific Ocean Cleanup Alliance',
    orgType: 'Marine Conservation NGO',
    title: 'Newport Harbor & Estuary Ghost Gear Recovery',
    description: 'Specialist volunteer dive and kayak team recovering derelict crab pots, nylon monofilament line, and submerged plastic waste.',
    locationName: 'Newport Beach Back Bay Estuary',
    waterbodyType: 'estuary',
    coordinates: [33.6189, -117.8984],
    date: '2026-12-06',
    time: '08:30',
    targetVolunteers: 30,
    registeredVolunteers: [],
    equipmentProvided: [
      'Utility kayaks & life jackets',
      'Grappling hooks & line cutters',
      'Heavy cargo recovery bags'
    ],
    contactEmail: 'coordinator@pacificcleanup.org',
    status: 'upcoming',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
  }
];
