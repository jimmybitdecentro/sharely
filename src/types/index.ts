export type ThemeMode = 'light' | 'dark';
export type Language = 'en' | 'hi' | 'es';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  city?: string;
  profilePicture?: string;
  occupation?: string;
  interests?: string;
  age?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

