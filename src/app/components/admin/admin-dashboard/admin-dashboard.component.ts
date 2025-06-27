import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DashboardStats } from "../../../models/post.model";
import { PostService } from "../../../services/post.service";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
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
