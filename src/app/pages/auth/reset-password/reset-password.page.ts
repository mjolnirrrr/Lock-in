import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonItem,
  IonInput, IonButton, IonSpinner, IonText, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';

import { MockAuthService } from '../../../services/mock-auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonItem, IonInput, IonButton, IonSpinner, IonText, IonIcon
  ],
  template: `
    @if (!done()) {
      <ion-header class="ion-no-border">
  <div class="auth-container">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/login" text=""></ion-back-button>
      </ion-buttons>
    </ion-toolbar>
  </div>
</ion-header>

      <ion-content class="ion-padding">
        <div class="auth-container">
          <div class="success-wrapper">
            <h1>Reset password</h1>
            <p class="subtitle">Enter your new password.</p>

            <ion-item class="form-field" lines="none">
              <ion-input label="New password" labelPlacement="stacked" placeholder="Enter new password"
                        type="password" [(ngModel)]="password" helperText="Minimum 8 characters"></ion-input>
            </ion-item>

            <ion-item class="form-field" lines="none">
              <ion-input label="Confirm new password" labelPlacement="stacked" placeholder="Confirm new password"
                        type="password" [(ngModel)]="confirmPassword"></ion-input>
            </ion-item>

            @if (error()) {
              <ion-text color="danger"><p class="error">{{ error() }}</p></ion-text>
            }

            <ion-button expand="block" color="dark" class="full-width-btn" (click)="reset()" [disabled]="loading()">
              @if (loading()) { <ion-spinner name="dots"></ion-spinner> } @else { Reset password }
            </ion-button>
          </div>
        </div>
      </ion-content>
    } @else {
      <ion-content class="ion-padding">
        <div class="success-wrapper">
          <div class="check-circle"><ion-icon name="checkmark-outline"></ion-icon></div>
          <h1>Password updated!</h1>
          <p class="subtitle">Your password has been successfully changed.</p>
          <ion-button expand="block" color="dark" class="full-width-btn" (click)="goLogin()">Log in</ion-button>
          <a class="back-home" (click)="goHome()">Back to home</a>
        </div>
      </ion-content>
    }
  `,
  styles: [`
    :host {
  display: block;
}

.auth-container {
  max-width: 600px;
  margin: 0 auto;
}

ion-toolbar {
  --padding-start: 0;
  --padding-end: 0;
}

h1 {
  font-size: 24px;
  margin: 4px 0 8px;
}

.subtitle {
  color: var(--ion-color-medium);
  margin-bottom: 24px;
  font-size: 14px;
}

.error {
  font-size: 13px;
  margin: -6px 0 10px;
}

.success-wrapper {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 340px;
  margin: 0 auto;
}

.back-home {
  display: inline-block;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-medium);
  cursor: pointer;
}
  `]
})
export class ResetPasswordPage {
  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');
  done = signal(false);

  constructor(private auth: MockAuthService, private router: Router) {
    addIcons({ checkmarkOutline });
  }

  async reset() {
    this.error.set('');

    if (this.password.length < 8) {
      this.error.set('Password must be at least 8 characters.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    await this.auth.resetPassword(this.password);
    this.loading.set(false);
    this.done.set(true);
  }

  goLogin() {
    this.router.navigateByUrl('/login');
  }

  goHome() {
    this.router.navigateByUrl('/');
  }
}