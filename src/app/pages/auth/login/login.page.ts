import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonItem,
  IonInput, IonButton, IonIcon, IonSpinner, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logoApple, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { MockAuthService } from '../../../services/mock-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule, RouterLink, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonItem, IonInput, IonButton, IonIcon, IonSpinner, IonText
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
      <h1>Log in</h1>
      <p class="subtitle">Welcome back!</p>

      <ion-item class="form-field" lines="none">
        <ion-input label="Email" labelPlacement="stacked" placeholder="Enter your email"
                   type="email" [(ngModel)]="email"></ion-input>
      </ion-item>

      <ion-item class="form-field" lines="none">
        <ion-input label="Password" labelPlacement="stacked" placeholder="Enter your password"
                   [type]="showPassword() ? 'text' : 'password'" [(ngModel)]="password">
          <ion-icon slot="end" [name]="showPassword() ? 'eye-off-outline' : 'eye-outline'"
                    (click)="showPassword.set(!showPassword())"></ion-icon>
        </ion-input>
      </ion-item>

      @if (error()) {
        <ion-text color="danger"><p class="error">{{ error() }}</p></ion-text>
      }

      <a class="forgot" routerLink="/forgot-password">Forgot password?</a>

      <ion-button expand="block" color="dark" class="full-width-btn" (click)="login()" [disabled]="loading()">
        @if (loading()) { <ion-spinner name="dots"></ion-spinner> } @else { Log in }
      </ion-button>

      <div class="divider"><span>or continue with</span></div>

      <div class="social-row">
        <ion-button fill="outline" color="dark" class="social-btn">
          <ion-icon slot="start" name="logo-google"></ion-icon> Google
        </ion-button>
        <ion-button fill="outline" color="dark" class="social-btn">
          <ion-icon slot="start" name="logo-apple"></ion-icon> Apple
        </ion-button>
      </div>

      <p class="footer-link">
        Don't have an account? <a routerLink="/signup">Sign up</a>
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

    h1 { font-size: 26px; margin: 4px 0 2px; }
    .subtitle { color: var(--ion-color-medium); margin-bottom: 24px; font-size: 14px; }
    .error { font-size: 13px; margin: -6px 0 10px; }
    .forgot {
      display: block;
      text-align: right;
      font-size: 13px;
      color: var(--ion-color-medium);
      text-decoration: none;
      margin-bottom: 22px;
    }
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--ion-color-medium);
      font-size: 12px;
      margin: 22px 0;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--ion-color-light-shade);
    }
    .divider span { padding: 0 10px; }
    .social-row {
  display: flex;
  gap: 12px;
}

@media (min-width: 768px) {
  .social-row {
    max-width: 400px;
    margin: 0 auto;
  }
}
    .social-btn { flex: 1; --border-radius: var(--app-radius-md); height: 48px; text-transform: none; }
    .footer-link {
      text-align: center;
      margin-top: 26px;
      font-size: 13px;
      color: var(--ion-color-medium);
    }
    .footer-link a { color: var(--ion-color-dark); font-weight: 600; text-decoration: none; }
    ion-icon[slot='end'] { cursor: pointer; color: var(--ion-color-medium); }
  `]
})
export class LoginPage {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  constructor(private auth: MockAuthService, private router: Router) {
    addIcons({ logoGoogle, logoApple, eyeOutline, eyeOffOutline });
  }

  async login() {
    this.error.set('');
    this.loading.set(true);
    const res = await this.auth.login(this.email, this.password);
    this.loading.set(false);
    if (res.success) {
      this.router.navigateByUrl('/tabs/home');
    } else {
      this.error.set(res.message ?? 'Something went wrong.');
    }
  }
}
