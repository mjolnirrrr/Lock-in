import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonIcon, IonButton, IonBadge, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline, checkmarkCircle, ellipseOutline, chevronForward,
  addOutline, folderOutline, calculatorOutline, planetOutline, flaskOutline, leafOutline
} from 'ionicons/icons';
import { MockDataService } from '../../services/mock-data.service';
import { AddQuizModalComponent } from '../../components/add-quiz-modal/add-quiz-modal.component';
import { AddMaterialModalComponent } from '../../components/add-material-modal/add-material-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, IonBadge],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  // Dependency Injection using inject()
  public data = inject(MockDataService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  // Computed Signal for Name Extraction
  readonly firstName = computed(() => {
    const fullName = this.data.profile()?.name || '';
    return fullName.split(' ')[0] || 'Student';
  });

  // Computed Signal for Time-Based Greeting
  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });

  constructor() {
    addIcons({
      notificationsOutline, checkmarkCircle, ellipseOutline, chevronForward,
      addOutline, folderOutline, calculatorOutline, planetOutline, flaskOutline, leafOutline
    });
  }

  toggle(id: string): void {
    this.data.toggleTaskDone(id);
  }

  goCalendar(): void {
    this.router.navigateByUrl('/tabs/calendar');
  }

  goStudy(): void {
    this.router.navigateByUrl('/tabs/study');
  }

  async openAddQuiz(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddQuizModalComponent,
      breakpoints: [0, 0.95],
      initialBreakpoint: 0.95
    });
    await modal.present();
  }

  async openAddMaterial(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddMaterialModalComponent,
      breakpoints: [0, 0.95],
      initialBreakpoint: 0.95
    });
    await modal.present();
  }
}
