import { Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import { AuthorGuard } from "./guards/author.guard";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/public/home-managment/home.component").then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: "post/:slug",
    loadComponent: () =>
      import(
        "./components/public/post-detail-management.component/post-detail.component"
      ).then((m) => m.PostDetailComponent),
  },
  {
    path: "login",
    loadComponent: () =>
      import("./components/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./components/auth/register/register.component").then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: "author",
    canActivate: [AuthorGuard],
    loadComponent: () =>
      import(
        "./components/author/author-dashboard/author-dashboard.component"
      ).then((m) => m.AuthorDashboardComponent),
  },
  {
    path: "author/posts",
    canActivate: [AuthorGuard],
    loadComponent: () =>
      import("./components/author/post-list/post-list.component").then(
        (m) => m.PostListComponent
      ),
  },
  {
    path: "author/create-post",
    canActivate: [AuthorGuard],
    loadComponent: () =>
      import("./components/author/post-editor/post-editor.component").then(
        (m) => m.PostEditorComponent
      ),
  },
  {
    path: "author/edit-post/:id",
    canActivate: [AuthorGuard],
    loadComponent: () =>
      import("./components/author/post-editor/post-editor.component").then(
        (m) => m.PostEditorComponent
      ),
  },
  {
    path: "admin",
    canActivate: [AdminGuard],
    loadComponent: () =>
      import(
        "./components/admin/admin-dashboard/admin-dashboard.component"
      ).then((m) => m.AdminDashboardComponent),
  },
  {
    path: "admin/users",
    canActivate: [AdminGuard],
    loadComponent: () =>
      import(
        "./components/admin/user-management/user-management.component"
      ).then((m) => m.UserManagementComponent),
  },
  {
    path: "admin/posts",
    canActivate: [AdminGuard],
    loadComponent: () =>
      import(
        "./components/admin/post-management/post-management.component"
      ).then((m) => m.PostManagementComponent),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
