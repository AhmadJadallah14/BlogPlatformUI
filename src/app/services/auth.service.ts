import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
} from "../models/auth.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem("token", response.token);
          localStorage.setItem("userData", JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.API_URL}/register`,
      userData
    );
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    return token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles?.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole("Admin");
  }

  isAuthor(): boolean {
    return this.hasRole("Author") || this.hasRole("Admin");
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }
}
