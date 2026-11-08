import { DischargePlan } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface LocalUser {
  uid: string;
  email: string;
  displayName?: string | null;
  hospitalCode?: string;
}

export interface RegisteredAccount {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  hospitalCode?: string;
  createdAt: string;
}

export const MAX_DAILY_GENERATIONS = 5;

const REGISTERED_USERS_KEY = 'discharge_care_registered_users';
const CURRENT_USER_KEY = 'discharge_care_current_user';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_dischargecare_salt_v1");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getRegisteredUsers(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading registered users:', err);
  }
  return [];
}

function saveRegisteredUsers(users: RegisteredAccount[]): void {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Error saving registered users:', err);
  }
}

/**
 * Listens to local auth state changes
 */
export function subscribeToAuthChanges(callback: (user: LocalUser | null) => void) {
  const checkUser = () => {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (raw) {
        callback(JSON.parse(raw) as LocalUser);
        return;
      }
    } catch {
      // Ignore
    }
    callback(null);
  };

  // Immediate check
  checkUser();

  // Listen to cross-tab storage changes
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === CURRENT_USER_KEY) {
      checkUser();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}

/**
 * Registers a new account locally in browser storage
 */
export async function registerLocalUser(
  email: string,
  password: string,
  displayName?: string,
  hospitalCode?: string
): Promise<LocalUser> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.');
  }

  const users = getRegisteredUsers();
  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please log in.');
  }

  const passwordHash = await hashPassword(password);
  const uid = 'usr_' + normalizedEmail.replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
  const userDisplayName = displayName || normalizedEmail.split('@')[0];

  const newAccount: RegisteredAccount = {
    uid,
    email: normalizedEmail,
    displayName: userDisplayName,
    passwordHash,
    hospitalCode,
    createdAt: new Date().toISOString()
  };

  users.push(newAccount);
  saveRegisteredUsers(users);

  const localUser: LocalUser = {
    uid,
    email: normalizedEmail,
    displayName: userDisplayName,
    hospitalCode
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(localUser));
  return localUser;
}

/**
 * Logs in an existing account by checking hashed password match in browser storage
 */
export async function loginLocalUser(email: string, password: string): Promise<LocalUser> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    throw new Error('Please provide both email and password.');
  }

  let users = getRegisteredUsers();
  
  // Seed default demo account if empty
  if (users.length === 0) {
    const defaultHash = await hashPassword('password123');
    const defaultAcc: RegisteredAccount = {
      uid: 'usr_patient_hospital_org',
      email: 'patient@hospital.org',
      displayName: 'Patient User',
      passwordHash: defaultHash,
      createdAt: new Date().toISOString()
    };
    users.push(defaultAcc);
    saveRegisteredUsers(users);
  }

  const userAcc = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!userAcc) {
    // If logging in with a new email, auto-create the account or inform user
    const passwordHash = await hashPassword(password);
    const uid = 'usr_' + normalizedEmail.replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    const userDisplayName = normalizedEmail.split('@')[0];
    const newAccount: RegisteredAccount = {
      uid,
      email: normalizedEmail,
      displayName: userDisplayName,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    users.push(newAccount);
    saveRegisteredUsers(users);

    const localUser: LocalUser = {
      uid: newAccount.uid,
      email: newAccount.email,
      displayName: newAccount.displayName
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(localUser));
    return localUser;
  }

  const inputHash = await hashPassword(password);
  if (inputHash !== userAcc.passwordHash) {
    throw new Error('Incorrect password. Please try again.');
  }

  const localUser: LocalUser = {
    uid: userAcc.uid,
    email: userAcc.email,
    displayName: userAcc.displayName,
    hospitalCode: userAcc.hospitalCode
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(localUser));
  return localUser;
}

/**
 * Resets local account password
 */
export async function resetLocalUserPassword(email: string, newPassword?: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  const userIdx = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

  if (userIdx === -1) {
    throw new Error('No account found with this email address.');
  }

  if (newPassword) {
    users[userIdx].passwordHash = await hashPassword(newPassword);
    saveRegisteredUsers(users);
  }
}

/**
 * Logs out current user from local storage session
 */
export async function logoutUser(): Promise<void> {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (err) {
    console.warn('Sign out error:', err);
  }
}

/**
 * Saves/updates user profile metadata in Local Storage
 */
export async function saveUserProfile(userId: string, email: string, displayName?: string | null): Promise<void> {
  try {
    const userObj: LocalUser = {
      uid: userId,
      email,
      displayName: displayName || email.split('@')[0]
    };
    localStorage.setItem(`user_profile_${userId}`, JSON.stringify(userObj));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
  } catch (error) {
    console.warn('Error saving user profile to localStorage:', error);
  }
}

/**
 * Fetches saved DischargePlan for a user from Local Storage
 */
export async function fetchUserPlan(userId: string): Promise<DischargePlan | null> {
  try {
    const raw = localStorage.getItem(`discharge_plan_${userId}`);
    if (raw) {
      return JSON.parse(raw) as DischargePlan;
    }
  } catch (error) {
    console.warn('Error reading plan from localStorage:', error);
  }
  return null;
}

/**
 * Saves or updates DischargePlan for a user in Local Storage
 */
export async function saveUserPlan(userId: string, plan: DischargePlan): Promise<void> {
  try {
    localStorage.setItem(`discharge_plan_${userId}`, JSON.stringify(plan));
  } catch (error) {
    console.warn('Error saving plan to localStorage:', error);
  }
}

/**
 * Checks and updates per-user daily plan generation limit in Local Storage
 */
export async function checkAndUpdateDailyGenerationLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const todayStr = new Date().toISOString().split('T')[0];
  const storageKey = `user_usage_${userId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    let usage = { count: 0, date: todayStr };
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === todayStr) {
        usage = parsed;
      }
    }

    if (usage.count >= MAX_DAILY_GENERATIONS) {
      return { allowed: false, remaining: 0 };
    }

    usage.count += 1;
    usage.date = todayStr;
    localStorage.setItem(storageKey, JSON.stringify(usage));

    return { allowed: true, remaining: MAX_DAILY_GENERATIONS - usage.count };
  } catch {
    return { allowed: true, remaining: 1 };
  }
}
