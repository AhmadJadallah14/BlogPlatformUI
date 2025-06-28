import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = "";
  successMessage = "";
  showPassword = false;
  showPasswordInstructions = false;
  hasSpecialChar(value: string): boolean {
    if (!value) return false;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    return specialChars.test(value);
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      userName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.successMessage = "Account created successfully! Please sign in.";
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = "Registration failed. Please try again.";
        },
      });
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
