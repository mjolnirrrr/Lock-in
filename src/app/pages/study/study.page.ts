import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonProgressBar,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline, documentTextOutline, imageOutline, addOutline, folderOutline
} from 'ionicons/icons';
import { MockDataService } from '../../services/mock-data.service';
import { AddQuizModalComponent } from '../../components/add-quiz-modal/add-quiz-modal.component';
import { AddMaterialModalComponent } from '../../components/add-material-modal/add-material-modal.component';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonProgressBar],
  template: `
    <ion-header class="ion-no-border">
      <div class="study-container">
        <ion-toolbar>
          <ion-title>My Study</ion-title>
          <ion-button slot="end" fill="clear" aria-label="Search">
            <ion-icon slot="icon-only" name="search-outline"></ion-icon>
          </ion-button>
        </ion-toolbar>
      </div>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="study-container">
        <!-- Subjects Section -->
        <section class="section-header" style="margin-top: 0;">
          <h3>Subjects</h3>
        </section>

        <div class="subject-list">
          @for (s of data.subjects(); track s.id) {
            <div 
              class="soft-card subject-row" 
              (click)="goMaterials(s.id)"
              (keydown.enter)="goMaterials(s.id)"
              (keydown.space)="goMaterials(s.id)"
              role="button"
              tabindex="0"
            >
              <div class="subject-icon" [style.background]="s.color + '1A'">
                <ion-icon [name]="s.icon" [style.color]="s.color"></ion-icon>
              </div>
              <div class="subject-info">
                <p class="subject-name">{{ s.name }}</p>
                <span class="subject-meta">{{ s.topicCount }} topics</span>
                <ion-progress-bar [value]="s.progress / 100" [style.--progress-background]="s.color"></ion-progress-bar>
              </div>
              <span class="progress-pct">{{ s.progress }}%</span>
            </div>
          }
        </div>

        <!-- Recent Materials Section -->
        <section class="section-header">
          <h3>Recent Materials</h3>
          <button type="button" class="link-btn" (click)="goMaterials()">View all</button>
        </section>

        <div class="soft-card materials-card">
          @for (m of recentMaterials(); track m.id) {
            <div class="material-row">
              <ion-icon 
                [name]="m.kind === 'image' ? 'image-outline' : 'document-text-outline'"
                [style.color]="m.kind === 'image' ? 'var(--ion-color-tertiary, #6C63FF)' : 'var(--ion-color-danger, #EB5757)'"
              ></ion-icon>
              <div class="material-text">
                <p>{{ m.name }}</p>
                <span>{{ m.kind.toUpperCase() }} &middot; {{ m.size }}</span>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <p>No materials yet.</p>
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

        <div style="height: 55px;"></div>

      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      display: block;
    }

    .study-container {
      max-width: 600px;
      margin: 0 auto;
    }

    ion-toolbar {
      --padding-start: 0;
      --padding-end: 0;
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

    .subject-list { 
      display: flex; 
      flex-direction: column; 
      gap: 12px; 
      margin-bottom: 8px; 
    }

    .subject-row { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      cursor: pointer; 
      outline: none;
    }

    .subject-icon { 
      width: 42px; 
      height: 42px; 
      border-radius: 12px; 
      flex-shrink: 0; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      
      ion-icon { 
        font-size: 19px; 
      } 
    }

    .subject-info { 
      flex: 1; 
      min-width: 0; 
    }

    .subject-name { 
      margin: 0; 
      font-size: 14.5px; 
      font-weight: 600; 
      color: var(--ion-text-color, #000);
    }

    .subject-meta { 
      font-size: 11.5px; 
      color: var(--ion-color-medium); 
    }

    ion-progress-bar { 
      margin-top: 6px; 
      border-radius: 3px; 
      height: 5px; 
    }

    .progress-pct { 
      font-size: 12px; 
      font-weight: 600; 
      color: var(--ion-color-medium); 
    }

    .materials-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 8px;
}

    .material-row { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
    }

    .material-row ion-icon { 
      font-size: 22px; 
      flex-shrink: 0; 
    }

    .material-text {
      flex: 1;
      min-width: 0;
    }

    .material-text p { 
      margin: 0; 
      font-size: 14px; 
      font-weight: 500; 
      color: var(--ion-text-color, #000);
    }

    .material-text span { 
      font-size: 11.5px; 
      color: var(--ion-color-medium); 
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 0;
      color: var(--ion-color-medium);
      font-size: 13px;
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
  `]
})
export class StudyPage {
  public data = inject(MockDataService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  readonly recentMaterials = computed(() => {
    return this.data.materials().slice(0, 4);
  });

  constructor() {
    addIcons({ searchOutline, documentTextOutline, imageOutline, addOutline, folderOutline });
  }

  goMaterials(subjectId?: string): void {
    this.router.navigate(['/materials'], subjectId ? { queryParams: { subjectId } } : {});
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