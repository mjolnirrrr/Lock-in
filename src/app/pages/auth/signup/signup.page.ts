import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonItem,
  IonInput, IonButton, IonCheckbox, IonSpinner, IonText
} from '@ionic/angular/standalone';

import { MockAuthService } from '../../../services/mock-auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule, RouterLink, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonItem, IonInput, IonButton, IonCheckbox, IonSpinner, IonText
  ],
  template: `
    <ion-header class="ion-no-border">
  <div class="auth-container">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button defaultHref="/onboarding" text=""></ion-back-button>
      </ion-buttons>
    </ion-toolbar>
  </div>
</ion-header>

    <ion-content class="ion-padding">
      <div class="auth-container">
        <h1>Sign up</h1>
        <p class="subtitle">Create your account</p>

        <ion-item class="form-field" lines="none">
          <ion-input label="Full name" labelPlacement="stacked" placeholder="Enter your name" [(ngModel)]="name"></ion-input>
        </ion-item>

        <ion-item class="form-field" lines="none">
          <ion-input label="Email" labelPlacement="stacked" placeholder="Enter your email" type="email" [(ngModel)]="email"></ion-input>
        </ion-item>

        <ion-item class="form-field" lines="none">
          <ion-input label="Password" labelPlacement="stacked" placeholder="Create a password" type="password" [(ngModel)]="password"></ion-input>
        </ion-item>

        <ion-item class="form-field" lines="none">
          <ion-input label="Confirm password" labelPlacement="stacked" placeholder="Confirm your password" type="password" [(ngModel)]="confirmPassword"></ion-input>
        </ion-item>

        @if (error()) {
          <ion-text color="danger"><p class="error">{{ error() }}</p></ion-text>
        }

        <ion-item lines="none" class="terms-item">
          <ion-checkbox slot="start" [(ngModel)]="agreedToTerms"></ion-checkbox>
          <span class="terms-text">I agree to the Terms of Service and Privacy Policy</span>
        </ion-item>

        <ion-button expand="block" color="dark" class="full-width-btn" (click)="signup()" [disabled]="loading()">
          @if (loading()) { <ion-spinner name="dots"></ion-spinner> } @else { Sign up }
        </ion-button>

        <p class="footer-link">
          Already have an account? <a routerLink="/login">Log in</a>
        </p>
    </div>
    </ion-content>
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
  font-size: 26px;
  margin: 4px 0 2px;
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

.terms-item {
  --background: transparent;
  --padding-start: 0;
  margin-bottom: 20px;
  align-items: flex-start;
}

.terms-text {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-left: 8px;
  line-height: 1.4;
}

.footer-link {
  text-align: center;
  margin-top: 26px;
  font-size: 13px;
  color: var(--ion-color-medium);
}

.footer-link a {
  color: var(--ion-color-dark);
  font-weight: 600;
  text-decoration: none;
}
  `]
})
export class SignupPage {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  agreedToTerms = false;
  loading = signal(false);
  error = signal('');

  constructor(private auth: MockAuthService, private router: Router) {}

  async signup() {
    this.error.set('');

    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match.');
      return;
    }
    if (!this.agreedToTerms) {
      this.error.set('Please agree to the Terms of Service to continue.');
      return;
    }

    this.loading.set(true);
    const res = await this.auth.signup(this.name, this.email, this.password);
    this.loading.set(false);

    if (res.success) {
      this.router.navigateByUrl('/tabs/home');
    } else {
      this.error.set(res.message ?? 'Something went wrong.');
    }
  }
}
