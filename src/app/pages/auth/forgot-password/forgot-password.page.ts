import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonItem,
  IonInput, IonButton, IonSpinner, IonText
} from '@ionic/angular/standalone';

import { MockAuthService } from '../../../services/mock-auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule, RouterLink, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonItem, IonInput, IonButton, IonSpinner, IonText
  ],
  template: `
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
        <h1>Forgot password?</h1>
        <p class="subtitle">Enter your email and we'll send you a reset link.</p>

        <ion-item class="form-field" lines="none">
          <ion-input label="Email" labelPlacement="stacked" placeholder="Enter your email" type="email" [(ngModel)]="email"></ion-input>
        </ion-item>

        @if (error()) {
          <ion-text color="danger"><p class="error">{{ error() }}</p></ion-text>
        }
        @if (sent()) {
          <ion-text color="success"><p class="error">Reset link sent — check your inbox!</p></ion-text>
        }

        <ion-button expand="block" color="dark" class="full-width-btn" (click)="send()" [disabled]="loading()">
          @if (loading()) { <ion-spinner name="dots"></ion-spinner> } @else { Send reset link }
        </ion-button>

        <p class="footer-link">
          Remember your password? <a routerLink="/login">Log in</a>
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

/* Optional: narrower form on tablets */
@media (min-width: 768px) {
  .auth-container {
    max-width: 600px;
  }
}
  `]
})
export class ForgotPasswordPage {
  email = '';
  loading = signal(false);
  error = signal('');
  sent = signal(false);

  constructor(private auth: MockAuthService, private router: Router) {}

  async send() {
    this.error.set('');
    this.sent.set(false);
    this.loading.set(true);
    const res = await this.auth.sendResetLink(this.email);
    this.loading.set(false);

    if (res.success) {
      this.sent.set(true);
      setTimeout(() => this.router.navigateByUrl('/reset-password'), 900);
    } else {
      this.error.set(res.message ?? 'Something went wrong.');
    }
  }
}
