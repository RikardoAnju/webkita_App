export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  groupId: number;
  role: 'pembeli' | 'developer';
  isAktif: 'Y' | 'N';
  subscribeNewsletter: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: string;
  group_id?: number;
  is_aktif?: 'Y' | 'N';
  first_name?: string;
  last_name?: string;
  phone?: string;
  subscribe_newsletter: boolean;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}