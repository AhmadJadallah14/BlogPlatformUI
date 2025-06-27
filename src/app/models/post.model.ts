export interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  coverImageUrl: string;
  isPublished: boolean;
  createdOn: string;
  tags: string[];
}

export interface CreatePostRequest {
  title: string;
  body: string;
  tags: string[];
  coverImage?: File;
}

export interface UpdatePostRequest {
  postId: number;
  title: string;
  body: string;
  tags: string[];
  coverImageUrl?: File;
}

export interface PostsResponse {
  items: Post[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
}

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
  errors: string[];
}