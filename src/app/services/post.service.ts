import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Post,
  PostsResponse,
  CreatePostRequest,
  UpdatePostRequest,
  DashboardStats,
  ApiResponse,
} from "../models/post.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private readonly API_URL = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/Dashboard/dashboard`);
  }

  createPost(postData: CreatePostRequest): Observable<ApiResponse<number>> {
    const formData = new FormData();
    formData.append("Title", postData.title);
    formData.append("Body", postData.body);
    postData.tags.forEach((tag) => formData.append("Tags", tag));
    if (postData.coverImage) {
      formData.append("CoverImage", postData.coverImage);
    }
    return this.http.post<ApiResponse<number>>(
      `${this.API_URL}/Posts/create-post`,
      formData
    );
  }

  updatePost(postData: UpdatePostRequest): Observable<ApiResponse<boolean>> {
    const formData = new FormData();
    formData.append("PostId", postData.postId.toString());
    formData.append("Title", postData.title);
    formData.append("Body", postData.body);
    postData.tags.forEach((tag) => formData.append("Tags", tag));
    if (postData.coverImageUrl) {
      formData.append("CoverImageUrl", postData.coverImageUrl);
    }
    return this.http.put<ApiResponse<boolean>>(
      `${this.API_URL}/Posts/update-post`,
      formData
    );
  }

  getMyPosts(
    pageIndex: number = 1,
    pageSize: number = 10
  ): Observable<PostsResponse> {
    const params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString());
    return this.http.get<PostsResponse>(`${this.API_URL}/Posts/my-posts`, {
      params,
    });
  }

  getAllPosts(
    pageIndex: number = 1,
    pageSize: number = 10
  ): Observable<PostsResponse> {
    const body = { pageIndex, pageSize };
    return this.http.post<PostsResponse>(
      `${this.API_URL}/Posts/GetAllPosts`,
      body
    );
  }

  getPublicPosts(
    pageIndex: number = 1,
    pageSize: number = 10
  ): Observable<PostsResponse> {
    const params = new HttpParams()
      .set("PageIndex", pageIndex.toString())
      .set("PageSize", pageSize.toString());
    return this.http.get<PostsResponse>("https://localhost:7264/PublicPosts", {
      params,
    });
  }

  getPostBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`https://localhost:7264/PublicPosts/${slug}`);
  }

  deletePost(postId: number): Observable<ApiResponse<number>> {
    return this.http.delete<ApiResponse<number>>(
      `${this.API_URL}/Posts/${postId}`
    );
  }

  publishPost(postId: number): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(
      `${this.API_URL}/Posts/${postId}/publish`,
      {}
    );
  }
}
