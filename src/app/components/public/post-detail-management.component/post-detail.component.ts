import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { PostService } from "../../../services/post.service";
import { Post } from "../../../models/post.model";
import { MarkdownModule } from "ngx-markdown";

@Component({
  selector: "app-post-detail",
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get("slug");
    if (slug) {
      this.loadPost(slug);
    } else {
      this.loading = false;
    }
  }

  loadPost(slug: string) {
    this.postService.getPostBySlug(slug).subscribe({
      next: (post) => {
        this.post = post;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading post:", error);
        this.post = null;
        this.loading = false;
      },
    });
  }

  isValidImageUrl(url: string): boolean {
    if (!url) return false;

    try {
      new URL(url);
      return true;
    } catch {
      return (
        url.startsWith("/") || url.startsWith("./") || url.startsWith("../")
      );
    }
  }

  onImageError(event: any) {
    const imageContainer = event.target.closest(".post-image");
    if (imageContainer) {
      imageContainer.style.display = "none";
    }
  }

  onImageLoad(event: any) {
    event.target.classList.remove("loading");
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  goBack() {
    this.router.navigate(["/"]);
  }
}
