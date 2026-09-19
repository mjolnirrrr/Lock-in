import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonList, IonItem, IonLabel, IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline, moonOutline, lockClosedOutline, helpCircleOutline,
  documentTextOutline, logOutOutline
} from 'ionicons/icons';
import { MockDataService } from '../../services/mock-data.service';
import { MockAuthService } from '../../services/mock-auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonList, IonItem, IonLabel, IonToggle],
  template: `
    <ion-header class="ion-no-border">
      <div class="profile-container">
        <ion-toolbar>
          <ion-title>Profile</ion-title>
        </ion-toolbar>
      </div>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="profile-container">

        <!-- Dynamic Card Layout -->
        <div class="profile-card" [class.soft-card]="isIos" [class.android-card]="!isIos">
          <div class="avatar">{{ data.profile().avatarInitials }}</div>
          <div>
            <p class="profile-name">{{ data.profile().name }}</p>
            <span class="profile-email">{{ data.profile().email }}</span>
          </div>
        </div>

        <div class="section-title">
          <h3>Preferences</h3>
        </div>

        <!-- Dynamic List Layout -->
        <ion-list [class.soft-card]="isIos" [class.android-list]="!isIos" lines="full">
          <ion-item>
            <ion-icon name="notifications-outline" slot="start" color="medium"></ion-icon>
            <ion-label>Notifications</ion-label>
            
            <!-- iOS Specific Toggle -->
            @if (isIos) {
              <ion-toggle class="custom-ios-toggle" mode="ios" slot="end" [checked]="true"></ion-toggle>
            }
            <!-- Android Specific Toggle (Previous version retained) -->
            @else {
              <ion-toggle class="custom-android-toggle" mode="md" slot="end" [checked]="true"></ion-toggle>
            }
          </ion-item>

          <ion-item>
            <ion-icon name="moon-outline" slot="start" color="medium"></ion-icon>
            <ion-label>Dark mode</ion-label>
            
            <!-- iOS Specific Toggle -->
            @if (isIos) {
              <ion-toggle class="custom-ios-toggle" mode="ios" slot="end" [checked]="false"></ion-toggle>
            }
            <!-- Android Specific Toggle (Previous version retained) -->
            @else {
              <ion-toggle class="custom-android-toggle" mode="md" slot="end" [checked]="false"></ion-toggle>
            }
          </ion-item>
        </ion-list>

        <div class="section-title">
          <h3>Account</h3>
        </div>

        <ion-list [class.soft-card]="isIos" [class.android-list]="!isIos" lines="full">
          <ion-item button detail="true">
            <ion-icon name="lock-closed-outline" slot="start" color="medium"></ion-icon>
            <ion-label>Change password</ion-label>
          </ion-item>

          <ion-item button detail="true">
            <ion-icon name="help-circle-outline" slot="start" color="medium"></ion-icon>
            <ion-label>Help & Support</ion-label>
          </ion-item>

          <ion-item button detail="true">
            <ion-icon name="document-text-outline" slot="start" color="medium"></ion-icon>
            <ion-label>Terms & Privacy</ion-label>
          </ion-item>

          <ion-item button (click)="logout()">
            <ion-icon name="log-out-outline" slot="start" color="danger"></ion-icon>
            <ion-label color="danger">Log out</ion-label>
          </ion-item>
        </ion-list>

      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      display: block;
    }

    .profile-container {
      max-width: 600px;
      margin: 0 auto;
    }

    ion-toolbar {
      --padding-start: 0;
      --padding-end: 0;
    }

    .profile-card {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
      padding: 16px;
    }

    /* ==========================================================================
       1. iOS-SPECIFIC STYLES
       ========================================================================== */
    .soft-card {
      background: var(--ion-card-background, var(--ion-background-color, #fff));
      border-radius: var(--app-radius-md, 16px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    }

    /* New iOS Image Design Toggle */
    ion-toggle.custom-ios-toggle {
      --track-border-radius: 50px;
      --track-background: #E9E9EA;
      --handle-background: #FFFFFF;
      --handle-border-radius: 50%;
      --handle-box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);

      --track-background-checked: #34C759;
      --handle-background-checked: #FFFFFF;
    }

    /* ==========================================================================
       2. ANDROID-SPECIFIC STYLES (Material Design 3 style toggle)
       ========================================================================== */
    .android-card {
      background: var(--ion-card-background, var(--ion-background-color, #fff));
      border-radius: 8px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
    }

    .android-list {
      background: var(--ion-card-background, var(--ion-background-color, #fff));
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    }

    /* Android MD3 Toggle */
    ion-toggle.custom-android-toggle {
      --track-background: #E8E8E8;
      --track-background-checked: var(--ion-color-primary, #6750A4);
      --handle-background: #FFFFFF;
      --handle-background-checked: #FFFFFF;
      --handle-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);

      width: 52px;
      height: 32px;
    }

    ion-toggle.custom-android-toggle::part(track) {
      border: 2px solid #C4C4C4;
      border-radius: 16px;
    }

    ion-toggle.custom-android-toggle.toggle-checked::part(track) {
      border-color: var(--ion-color-primary, #6750A4);
    }

    ion-toggle.custom-android-toggle::part(handle) {
      width: 14px;
      height: 14px;
      transition: width 0.2s ease, height 0.2s ease, transform 0.2s ease;
    }

    ion-toggle.custom-android-toggle.toggle-checked::part(handle) {
      width: 22px;
      height: 22px;
    }

    /* ==========================================================================
       SHARED STYLES
       ========================================================================== */
    .avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: var(--ion-color-dark);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 17px;
      flex-shrink: 0;
    }

    .profile-name {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .profile-email {
      font-size: 12.5px;
      color: var(--ion-color-medium);
    }

    .section-title {
      margin: 20px 4px 10px;
    }

    .section-title h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--ion-text-color, #000);
    }

    ion-list.soft-card, ion-list.android-list {
      padding: 4px 0;
      overflow: hidden;
    }
  `]
})
export class ProfilePage {
  private platform = inject(Platform);
  public isIos = this.platform.is('ios');

  constructor(public data: MockDataService, private auth: MockAuthService, private router: Router) {
    addIcons({
      notificationsOutline, moonOutline, lockClosedOutline, helpCircleOutline,
      documentTextOutline, logOutOutline
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/onboarding');
  }
}