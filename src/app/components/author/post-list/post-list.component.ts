import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PostService } from "../../../services/post.service";
import { Post } from "../../../models/post.model";

@Component({
  selector: "app-post-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"],
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  actionLoading: { [key: number]: boolean } = {};

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.postService.getMyPosts(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.posts = response.items;
        this.totalCount = response.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading posts:", error);
        this.loading = false;
      },
    });
  }

  publishPost(postId: number) {
    this.actionLoading[postId] = true;
    this.postService.publishPost(postId).subscribe({
      next: (response) => {
        if (response.succeeded) {
          const post = this.posts.find((p) => p.id === postId);
          if (post) {
            post.isPublished = true;
          }
        }
        this.actionLoading[postId] = false;
      },
      error: (error) => {
        console.error("Error publishing post:", error);
        this.actionLoading[postId] = false;
      },
    });
  }

  deletePost(postId: number) {
    if (confirm("Are you sure you want to delete this post?")) {
      this.actionLoading[postId] = true;
      this.postService.deletePost(postId).subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.posts = this.posts.filter((p) => p.id !== postId);
            this.totalCount--;
          }
          this.actionLoading[postId] = false;
        },
        error: (error) => {
          console.error("Error deleting post:", error);
          this.actionLoading[postId] = false;
        },
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPosts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPosts();
    }
  }
}
