import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/auth.model";
import { ApiResponse } from "../models/post.model";
import { environment } from "../../environments/environment";

interface UsersResponse {
  items: User[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

@Injectable({
  providedIn: "root",
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getUsers(
    pageIndex: number = 1,
    pageSize: number = 5
  ): Observable<UsersResponse> {
    const body = { pageIndex, pageSize };
    return this.http.post<UsersResponse>(
      `${this.API_URL}/Users/GetUsers`,
      body
    );
  }

  banUser(userId: string): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.API_URL}/Users/${userId}/ban`,
      {}
    );
  }

  deleteUser(userId: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(
      `${this.API_URL}/Users/${userId}/delete`
    );
  }

  promoteUser(userId: string): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.API_URL}/Users/${userId}/promote`,
      {}
    );
  }
}
