import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import {
  provideHttpClient,
  withInterceptors,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { routes } from "./app/app.routes";
import { NavbarComponent } from "./app/components/shared/navbar.component";
import { AuthService } from "./app/services/auth.service";
import { provideMarkdown } from "ngx-markdown";
import { authInterceptor } from "./app/interceptors/auth.interceptor";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .main-content {
        flex: 1;
      }
    `,
  ],
})
export class App {
  title = "BlogPlatform";
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideMarkdown(),
    AuthService,
  ],
}).catch((err) => console.error(err));
