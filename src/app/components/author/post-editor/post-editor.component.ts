import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { PostService } from "../../../services/post.service";
import { MarkdownModule } from "ngx-markdown";

@Component({
  selector: "app-post-editor",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MarkdownModule],
  templateUrl: "./post-editor.component.html",
  styleUrls: ["./post-editor.component.css"],
})
export class PostEditorComponent implements OnInit {
  postForm: FormGroup;
  loading = false;
  errorMessage = "";
  successMessage = "";
  isEditMode = false;
  postId?: number;
  selectedFile?: File;
  imagePreview?: string;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ["", [Validators.required]],
      body: ["", [Validators.required]],
      tagsInput: [""],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.isEditMode = true;
      this.postId = parseInt(id);
      this.loadPost();
    }
  }

  loadPost() {
    if (this.postId) {
      // In a real app, you'd load the post data here
      // For now, we'll just set edit mode
      console.log("Loading post with ID:", this.postId);
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        this.errorMessage = "Please select a valid image file (JPG, PNG, GIF)";
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.errorMessage = "Image file size must be less than 5MB";
        return;
      }

      this.selectedFile = file;
      this.errorMessage = "";

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = undefined;
    this.imagePreview = undefined;
    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  onContentChange() {
    // This method can be used for real-time preview updates if needed
  }

  onSubmit() {
    if (this.postForm.valid) {
      this.loading = true;
      this.errorMessage = "";
      this.successMessage = "";

      const formValue = this.postForm.value;
      const tags = formValue.tagsInput
        ? formValue.tagsInput
            .split(",")
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag)
        : [];

      if (this.isEditMode && this.postId) {
        const updateData = {
          postId: this.postId,
          title: formValue.title,
          body: formValue.body,
          tags: tags,
          coverImageUrl: this.selectedFile,
        };

        this.postService.updatePost(updateData).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.succeeded) {
              this.successMessage = response.message;
              setTimeout(() => this.router.navigate(["/author/posts"]), 2000);
            } else {
              this.errorMessage = response.message || "Failed to update post";
            }
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = "Failed to update post. Please try again.";
            console.error("Update post error:", error);
          },
        });
      } else {
        const createData = {
          title: formValue.title,
          body: formValue.body,
          tags: tags,
          coverImage: this.selectedFile,
        };

        this.postService.createPost(createData).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.succeeded) {
              this.successMessage = response.message;
              setTimeout(() => this.router.navigate(["/author/posts"]), 2000);
            } else {
              this.errorMessage = response.message || "Failed to create post";
            }
          },
          error: (error) => {
            this.loading = false;
            this.errorMessage = "Failed to create post. Please try again.";
            console.error("Create post error:", error);
          },
        });
      }
    }
  }

  goBack() {
    this.router.navigate(["/author/posts"]);
  }
}
