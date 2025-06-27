import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PostService } from "../../../services/post.service";
import { Post } from "../../../models/post.model";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 6;
  totalCount = 0;
  totalPages = 0;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.postService.getPublicPosts(this.currentPage, this.pageSize).subscribe({
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

  isValidImageUrl(url: string): boolean {
    if (!url) return false;

    // Check if URL is properly formatted
    try {
      new URL(url);
      return true;
    } catch {
      // If not a valid URL, check if it's a relative path
      return (
        url.startsWith("/") || url.startsWith("./") || url.startsWith("../")
      );
    }
  }

  onImageError(event: any) {
    // Hide the image container if image fails to load
    const imageContainer = event.target.closest(".post-image");
    if (imageContainer) {
      imageContainer.style.display = "none";
    }
  }

  getExcerpt(body: string): string {
    const maxLength = 150;
    // Remove markdown syntax for excerpt
    const plainText = body.replace(/[#*`_~\[\]()]/g, "");
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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
