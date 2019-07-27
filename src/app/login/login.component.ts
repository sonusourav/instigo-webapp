import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MatDialog ,MatToolbar, MatDialogRef,MatIcon } from "@angular/material";
import '../../assets/js/main.js';
declare var test: any;
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService,
              public dialogRef: MatDialogRef<LoginComponent>) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
      if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    this.dialogRef.close();
  }

  googleLogin() {
    this.authService.googleLogin();
  }
     onClose() {
    this.dialogRef.close();
}
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
