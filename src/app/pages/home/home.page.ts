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
  template: `
    <ion-content class="ion-padding">
      <div class="home-container">
        <!-- Topbar Header -->
        <header class="topbar">
          <div>
            <p class="greeting-eyebrow">{{ greeting() }}, {{ firstName() }}!</p>
            <h1>Let's make today productive.</h1>
          </div>
          <ion-button fill="clear" class="bell-btn" aria-label="Notifications">
            <ion-icon slot="icon-only" name="notifications-outline"></ion-icon>
            <ion-badge color="danger" class="bell-badge">2</ion-badge>
          </ion-button>
        </header>

        <!-- Today's Plan Section -->
        <section class="section-header">
          <h3>Today's Plan</h3>
          <button type="button" class="link-btn" (click)="goCalendar()">View all</button>
        </section>

        <div class="soft-card plan-card">
          @for (task of data.todaysTasks(); track task.id) {
            <div 
              class="plan-row" 
              (click)="toggle(task.id)"
              (keydown.enter)="toggle(task.id)"
              (keydown.space)="toggle(task.id)"
              role="checkbox"
              [attr.aria-checked]="task.done"
              tabindex="0"
            >
              <ion-icon 
                [name]="task.done ? 'checkmark-circle' : 'ellipse-outline'"
                [color]="task.done ? 'success' : 'medium'"
              ></ion-icon>
              <div class="plan-text">
                <p class="plan-title" [class.done]="task.done">{{ task.title }}</p>
                <span class="plan-time">{{ task.startTime }}{{ task.endTime ? ' - ' + task.endTime : '' }}</span>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <ion-icon name="checkmark-circle" color="medium"></ion-icon>
              <p>Nothing planned for today yet.</p>
            </div>
          }
        </div>

        <!-- Upcoming Section -->
        <section class="section-header">
          <h3>Upcoming</h3>
        </section>
        <div class="soft-card upcoming-card">
          <div class="upcoming-row">
            <div class="upcoming-icon">
              <ion-icon name="folder-outline"></ion-icon>
            </div>
            <div class="plan-text">
              <p class="plan-title">Study Session</p>
              <span class="plan-time">Physics &middot; Today 2:00 PM</span>
            </div>
            <ion-icon name="chevron-forward" color="medium"></ion-icon>
          </div>
        </div>

        <!-- Subjects Section -->
        <section class="section-header">
          <h3>Subjects</h3>
          <button type="button" class="link-btn" (click)="goStudy()">View all</button>
        </section>
        <div class="subjects-scroll">
          @for (s of data.subjects(); track s.id) {
            <div 
              class="subject-chip" 
              (click)="goStudy()"
              (keydown.enter)="goStudy()"
              role="button"
              tabindex="0"
            >
              <div class="subject-icon" [style.background]="s.color + '1A'">
                <ion-icon [name]="s.icon" [style.color]="s.color"></ion-icon>
              </div>
              <p>{{ s.name }}</p>
              <span>{{ s.topicCount }} topics</span>
            </div>
          }
        </div>

        <!-- Quick Actions Section -->
        <section class="section-header">
          <h3>Quick Actions</h3>
        </section>
        <div class="quick-actions">
          <button type="button" class="qa-btn" (click)="openAddQuiz()">
            <ion-icon name="add-outline"></ion-icon>
            <span>Add Quiz / Activity</span>
          </button>
          <button type="button" class="qa-btn" (click)="openAddMaterial()">
            <ion-icon name="folder-outline"></ion-icon>
            <span>Add Material</span>
          </button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      display: block;
    }

    .home-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .topbar { 
      display: flex; 
      align-items: flex-start; 
      justify-content: space-between; 
      padding: 0 4px 16px; 
    }

    .greeting-eyebrow { 
      margin: 0; 
      font-size: 13px; 
      color: var(--ion-color-medium); 
      font-weight: 500;
    }

    h1 { 
      font-size: 20px; 
      font-weight: 700;
      margin: 2px 0 0; 
      color: var(--ion-text-color, #000);
    }

    .bell-btn { 
      position: relative; 
      margin: 0; 
      --padding-start: 6px; 
      --padding-end: 6px; 
    }

    .bell-badge { 
      position: absolute; 
      top: 4px; 
      right: 4px; 
      font-size: 9px; 
      padding: 2px 5px; 
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 20px 0 10px;
      padding: 0 4px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--ion-text-color, #000);
    }

    .link-btn {
      background: none;
      border: none;
      padding: 0;
      font-size: 13px;
      font-weight: 500;
      color: var(--ion-color-primary, #3880ff);
      cursor: pointer;
    }

    .soft-card {
      background: var(--ion-card-background, var(--ion-background-color, #fff));
      border-radius: var(--app-radius-md, 16px);
      padding: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    }

    .plan-card { 
      display: flex; 
      flex-direction: column; 
      gap: 14px; 
    }

    .plan-row { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      cursor: pointer; 
      outline: none;
    }

    .plan-row ion-icon { 
      font-size: 22px; 
      flex-shrink: 0; 
    }

    .plan-text { 
      flex: 1; 
      min-width: 0; 
    }

    .plan-title { 
      margin: 0; 
      font-size: 14.5px; 
      font-weight: 500; 
      color: var(--ion-text-color, #000);
      transition: color 0.2s ease;
    }

    .plan-title.done { 
      text-decoration: line-through; 
      color: var(--ion-color-medium); 
    }

    .plan-time { 
      font-size: 12px; 
      color: var(--ion-color-medium); 
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px 0;
      gap: 6px;
      color: var(--ion-color-medium);
      font-size: 13px;
    }

    .empty-state ion-icon {
      font-size: 28px;
    }

    .upcoming-card { 
      padding: 14px 16px; 
    }

    .upcoming-row { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
    }

    .upcoming-icon { 
      width: 40px; 
      height: 40px; 
      border-radius: 12px; 
      background: var(--ion-color-light, #f4f5f8); 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      flex-shrink: 0; 
      
      ion-icon { 
        font-size: 18px; 
        color: var(--ion-color-dark, #222428);
      } 
    }

    .subjects-scroll { 
      display: flex; 
      gap: 12px; 
      overflow-x: auto; 
      padding: 4px 4px 12px; 
      scrollbar-width: none;
    }

    .subjects-scroll::-webkit-scrollbar {
      display: none;
    }

    .subject-chip { 
      flex: 0 0 auto; 
      width: 96px; 
      background: var(--ion-card-background, #fff); 
      border-radius: var(--app-radius-md, 16px); 
      padding: 14px 10px; 
      text-align: center; 
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04); 
      cursor: pointer; 
      outline: none;
    }

    .subject-icon { 
      width: 40px; 
      height: 40px; 
      border-radius: 12px; 
      margin: 0 auto 8px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      
      ion-icon { 
        font-size: 19px; 
      } 
    }

    .subject-chip p { 
      margin: 0; 
      font-size: 12.5px; 
      font-weight: 600; 
      color: var(--ion-text-color, #000);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subject-chip span { 
      font-size: 10.5px; 
      color: var(--ion-color-medium); 
    }

    .quick-actions { 
      display: flex; 
      gap: 12px; 
      margin-bottom: 16px; 
    }

    .qa-btn { 
      flex: 1; 
      background: var(--ion-card-background, #fff); 
      border: none; 
      border-radius: var(--app-radius-md, 16px); 
      padding: 16px 10px; 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      gap: 8px; 
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04); 
      font-size: 12px; 
      font-weight: 500; 
      color: var(--ion-text-color, #000);
      cursor: pointer;

      ion-icon { 
        font-size: 22px; 
        color: var(--ion-color-secondary, #3dc2ff); 
      } 
    }

    @media (min-width: 768px) {
      .greeting-eyebrow { font-size: 15px; }
      h1 { font-size: 24px; }
    }
  `]
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