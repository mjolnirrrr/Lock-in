import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { schoolOutline } from 'ionicons/icons';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [IonContent, IonIcon, IonButton],
  template: `
    <ion-content [fullscreen]="true" class="ion-padding">
      <div class="wrapper">
        <div class="art">
          <ion-icon name="school-outline"></ion-icon>
        </div>

        <h1>Lock In.<br />Achieve More.</h1>
        <p class="subtitle">Organize your study, track progress and ace your goals.</p>

        <div class="dots">
          <span class="dot active"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>

        <ion-button expand="block" class="full-width-btn" color="dark" (click)="goLogin()">Log in</ion-button>
        <ion-button expand="block" fill="outline" class="full-width-btn" color="dark" (click)="goSignup()">
          Sign up
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      max-width: 380px;
      margin: 0 auto;
    }
    .art {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: var(--ion-color-light);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 28px;

      ion-icon {
        font-size: 56px;
        color: var(--ion-color-dark);
      }
    }
    h1 {
      font-size: 28px;
      line-height: 1.25;
      margin: 0 0 10px;
    }
    .subtitle {
      color: var(--ion-color-medium);
      font-size: 14px;
      margin-bottom: 26px;
    }
    .dots {
      display: flex;
      gap: 6px;
      margin-bottom: 30px;
    }
    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--ion-color-light-shade);
    }
    .dot.active {
      width: 20px;
      border-radius: 4px;
      background: var(--ion-color-dark);
    }
    ion-button {
      width: 100%;
      margin-bottom: 12px;
    }
  `]
})
export class OnboardingPage {
  constructor(private router: Router) {
    addIcons({ schoolOutline });
  }

  goLogin() {
    this.router.navigateByUrl('/login');
  }

  goSignup() {
    this.router.navigateByUrl('/signup');
  }
}
