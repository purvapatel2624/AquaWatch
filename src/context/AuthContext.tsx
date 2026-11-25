import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserProfile, NgoProfile, UserRole } from '../types/auth';
import { DEMO_USER_ACCOUNT, DEMO_NGO_ACCOUNT, StoredAuthAccount } from '../data/mockAuthData';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isUser: boolean;
  isNgo: boolean;
  userProfile: UserProfile | null;
  ngoProfile: NgoProfile | null;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  registerNgo: (data: {
    orgName: string;
    orgType: string;
    officialEmail: string;
    contactPerson: string;
    contactNumber: string;
    operatingLocation: string;
    password: string;
    accreditationId?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateNgoProfile: (updates: Partial<NgoProfile>) => void;
  quickLoginDemo: (role: UserRole) => void;
}

const ACCOUNTS_STORAGE_KEY = 'aquawatch_accounts_v1';
const SESSION_STORAGE_KEY = 'aquawatch_session_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Initialize accounts and restore session
  useEffect(() => {
    try {
      const storedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (!storedAccounts) {
        const initialAccounts: StoredAuthAccount[] = [
          { profile: DEMO_USER_ACCOUNT, passwordHash: 'Password123!' },
          { profile: DEMO_NGO_ACCOUNT, passwordHash: 'Password123!' },
        ];
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(initialAccounts));
      }

      const activeSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (activeSession) {
        const parsed = JSON.parse(activeSession) as AuthUser;
        setCurrentUser(parsed);
      }
    } catch (e) {
      console.error('Error initializing authentication storage', e);
    }
  }, []);

  const getStoredAccounts = (): StoredAuthAccount[] => {
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse stored accounts', e);
    }
    return [
      { profile: DEMO_USER_ACCOUNT, passwordHash: 'Password123!' },
      { profile: DEMO_NGO_ACCOUNT, passwordHash: 'Password123!' },
    ];
  };

  const saveStoredAccounts = (accounts: StoredAuthAccount[]) => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  };

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const accounts = getStoredAccounts();

    const match = accounts.find((acc) => {
      const accEmail =
        acc.profile.role === 'user'
          ? (acc.profile as UserProfile).email.toLowerCase()
          : (acc.profile as NgoProfile).officialEmail.toLowerCase();
      return accEmail === cleanEmail && acc.profile.role === role;
    });

    if (!match) {
      return {
        success: false,
        error: `No ${role === 'ngo' ? 'NGO / Organization' : 'User'} account found with email "${email}". Please check your email or sign up.`,
      };
    }

    if (match.passwordHash !== password) {
      return {
        success: false,
        error: 'Incorrect password. (For demo testing, password is Password123!)',
      };
    }

    setCurrentUser(match.profile);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(match.profile));
    return { success: true };
  };

  const registerUser = async (data: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const accounts = getStoredAccounts();

    const existing = accounts.find((acc) => {
      const accEmail =
        acc.profile.role === 'user'
          ? (acc.profile as UserProfile).email.toLowerCase()
          : (acc.profile as NgoProfile).officialEmail.toLowerCase();
      return accEmail === cleanEmail;
    });

    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      role: 'user',
      fullName: data.fullName.trim(),
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      volunteerPoints: 100, // Welcome points
    };

    const updated = [...accounts, { profile: newUser, passwordHash: data.password }];
    saveStoredAccounts(updated);
    setCurrentUser(newUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));

    return { success: true };
  };

  const registerNgo = async (data: {
    orgName: string;
    orgType: string;
    officialEmail: string;
    contactPerson: string;
    contactNumber: string;
    operatingLocation: string;
    password: string;
    accreditationId?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.officialEmail.trim().toLowerCase();
    const accounts = getStoredAccounts();

    const existing = accounts.find((acc) => {
      const accEmail =
        acc.profile.role === 'user'
          ? (acc.profile as UserProfile).email.toLowerCase()
          : (acc.profile as NgoProfile).officialEmail.toLowerCase();
      return accEmail === cleanEmail;
    });

    if (existing) {
      return {
        success: false,
        error: 'An organization or user with this email address is already registered.',
      };
    }

    const newNgo: NgoProfile = {
      id: `ngo-${Date.now()}`,
      role: 'ngo',
      orgName: data.orgName.trim(),
      orgType: data.orgType.trim(),
      officialEmail: cleanEmail,
      contactPerson: data.contactPerson.trim(),
      contactNumber: data.contactNumber.trim(),
      operatingLocation: data.operatingLocation.trim(),
      accreditationId: data.accreditationId?.trim() || `NGO-REG-${Math.floor(1000 + Math.random() * 9000)}`,
      verificationStatus: 'verified', // Auto-granted verified status for credibility in demo
      createdAt: new Date().toISOString(),
      missionStatement: `Dedicated to monitoring and cleaning plastic pollution in ${data.operatingLocation}.`,
    };

    const updated = [...accounts, { profile: newNgo, passwordHash: data.password }];
    saveStoredAccounts(updated);
    setCurrentUser(newNgo);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newNgo));

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser || currentUser.role !== 'user') return;
    const updatedUser: UserProfile = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in stored accounts list
    const accounts = getStoredAccounts();
    const updatedAccounts = accounts.map((acc) =>
      acc.profile.id === updatedUser.id ? { ...acc, profile: updatedUser } : acc
    );
    saveStoredAccounts(updatedAccounts);
  };

  const updateNgoProfile = (updates: Partial<NgoProfile>) => {
    if (!currentUser || currentUser.role !== 'ngo') return;
    const updatedNgo: NgoProfile = { ...currentUser, ...updates };
    setCurrentUser(updatedNgo);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedNgo));

    // Update in stored accounts list
    const accounts = getStoredAccounts();
    const updatedAccounts = accounts.map((acc) =>
      acc.profile.id === updatedNgo.id ? { ...acc, profile: updatedNgo } : acc
    );
    saveStoredAccounts(updatedAccounts);
  };

  const quickLoginDemo = (role: UserRole) => {
    if (role === 'user') {
      setCurrentUser(DEMO_USER_ACCOUNT);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(DEMO_USER_ACCOUNT));
    } else {
      setCurrentUser(DEMO_NGO_ACCOUNT);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(DEMO_NGO_ACCOUNT));
    }
  };

  const isUser = currentUser?.role === 'user';
  const isNgo = currentUser?.role === 'ngo';
  const userProfile = isUser ? (currentUser as UserProfile) : null;
  const ngoProfile = isNgo ? (currentUser as NgoProfile) : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isUser,
        isNgo,
        userProfile,
        ngoProfile,
        login,
        registerUser,
        registerNgo,
        logout,
        updateUserProfile,
        updateNgoProfile,
        quickLoginDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
