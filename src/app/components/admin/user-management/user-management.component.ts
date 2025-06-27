import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/auth.model";

@Component({
  selector: "app-user-management",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  actionLoading: { [key: string]: boolean } = {};

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.items;
        this.totalCount = response.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading users:", error);
        this.loading = false;
      },
    });
  }

  banUser(userId: string) {
    if (confirm("Are you sure you want to ban this user?")) {
      this.actionLoading[userId] = true;
      this.userService.banUser(userId).subscribe({
        next: (response) => {
          if (response.succeeded) {
            const user = this.users.find((u) => u.id === userId);
            if (user) {
              user.isBanned = true;
            }
          }
          this.actionLoading[userId] = false;
        },
        error: (error) => {
          console.error("Error banning user:", error);
          this.actionLoading[userId] = false;
        },
      });
    }
  }

  promoteUser(userId: string) {
    if (confirm("Are you sure you want to promote this user to Admin?")) {
      this.actionLoading[userId] = true;
      this.userService.promoteUser(userId).subscribe({
        next: (response) => {
          if (response.succeeded) {
            const user = this.users.find((u) => u.id === userId);
            if (user) {
              user.role = "Admin";
            }
          }
          this.actionLoading[userId] = false;
        },
        error: (error) => {
          console.error("Error promoting user:", error);
          this.actionLoading[userId] = false;
        },
      });
    }
  }

  deleteUser(userId: string) {
    if (
      confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      this.actionLoading[userId] = true;
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          if (response.succeeded) {
            this.users = this.users.filter((u) => u.id !== userId);
            this.totalCount--;
          }
          this.actionLoading[userId] = false;
        },
        error: (error) => {
          console.error("Error deleting user:", error);
          this.actionLoading[userId] = false;
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
      this.loadUsers();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }
}
