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
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss'
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