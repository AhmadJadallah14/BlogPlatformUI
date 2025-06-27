export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface RegisterResponse {
  userId: string;
  userName: string;
  email: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdOn: string;
}