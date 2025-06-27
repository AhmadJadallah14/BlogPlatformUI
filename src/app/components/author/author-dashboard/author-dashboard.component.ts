import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PostService } from "../../../services/post.service";
import { DashboardStats } from "../../../models/post.model";

@Component({
  selector: "app-author-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./author-dashboard.component.html",
  styleUrls: ["./author-dashboard.component.css"],
})
export class AuthorDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.postService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error("Error loading stats:", error);
      },
    });
  }
}
