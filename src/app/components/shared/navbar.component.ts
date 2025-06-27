import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="nav-brand">
          <a routerLink="/">BlogPlatform</a>
        </div>

        <div class="nav-menu" [class.nav-menu-open]="isMenuOpen">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          
          <ng-container *ngIf="currentUser$ | async as user; else guestMenu">
            <a routerLink="/author" routerLinkActive="active" *ngIf="user.roles.includes('Author') || user.roles.includes('Admin')">
              Author Dashboard
            </a>
            <a routerLink="/admin" routerLinkActive="active" *ngIf="user.roles.includes('Admin')">
              Admin Panel
            </a>
            <span class="user-info">{{ user.userName }}</span>
            <button class="btn btn-secondary" (click)="logout()">Logout</button>
          </ng-container>

          <ng-template #guestMenu>
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Register</a>
          </ng-template>
        </div>

        <button class="nav-toggle" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #1976d2;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand a {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      background-color: rgba(255,255,255,0.1);
    }

    .user-info {
      color: #e3f2fd;
      font-size: 0.9rem;
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .nav-toggle span {
      width: 25px;
      height: 3px;
      background: white;
      margin: 3px 0;
      transition: 0.3s;
    }

    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        top: 70px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 70px);
        background: #1976d2;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding-top: 2rem;
        transition: left 0.3s ease;
      }

      .nav-menu-open {
        left: 0;
      }

      .nav-toggle {
        display: flex;
      }

      .nav-menu a,
      .nav-menu button {
        width: 80%;
        text-align: center;
        margin: 0.5rem 0;
      }
    }
  `]
})
export class NavbarComponent {
  currentUser$: Observable<AuthResponse | null>;
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}