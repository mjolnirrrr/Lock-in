import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flameOutline, timeOutline, ribbonOutline, trendingUpOutline } from 'ionicons/icons';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonProgressBar],
  template: `
    <ion-header class="ion-no-border">
  <div class="stats-container">
    <ion-toolbar>
      <ion-title>Your Progress</ion-title>
    </ion-toolbar>
  </div>
</ion-header>

    <ion-content class="ion-padding">
  <div class="stats-container">
    <div class="stat-grid">
      <div class="soft-card stat-tile">
        <ion-icon name="flame-outline" color="warning"></ion-icon>
        <h2>{{ data.profile().studyStreak }}</h2>
        <span>Day streak</span>
      </div>

      <div class="soft-card stat-tile">
        <ion-icon name="time-outline" color="secondary"></ion-icon>
        <h2>{{ data.profile().totalStudyHours }}h</h2>
        <span>Total study time</span>
      </div>

      <div class="soft-card stat-tile">
        <ion-icon name="ribbon-outline" color="success"></ion-icon>
        <h2>{{ data.profile().quizzesTaken }}</h2>
        <span>Quizzes taken</span>
      </div>

      <div class="soft-card stat-tile">
        <ion-icon name="trending-up-outline" color="danger"></ion-icon>
        <h2>{{ data.profile().averageScore }}%</h2>
        <span>Average score</span>
      </div>
    </div>

    <div class="section-title" style="margin-top:26px;">
      <h3>Today's Completion</h3>
    </div>

    <div class="soft-card">
      <div class="completion-row">
        <span>{{ data.completionRate() }}% of today's plan done</span>
      </div>
      <ion-progress-bar
        [value]="data.completionRate() / 100"
        color="dark">
      </ion-progress-bar>
    </div>

    <div class="section-title">
      <h3>Subject Progress</h3>
    </div>

    <div class="soft-card subject-progress-card">
      @for (s of data.subjects(); track s.id) {
        <div class="progress-item">
          <div class="progress-item-head">
            <span>{{ s.name }}</span>
            <span class="pct">{{ s.progress }}%</span>
          </div>

          <ion-progress-bar
            [value]="s.progress / 100"
            [style.--progress-background]="s.color">
          </ion-progress-bar>
        </div>
      }
    </div>
  </div>
</ion-content>
  `,
  styles: [`
    :host {
  display: block;
}

.stats-container {
  max-width: 600px;
  margin: 0 auto;
}
  
ion-toolbar {
  --padding-start: 0;
  --padding-end: 0;
}
  
.soft-card {
  background: var(--ion-card-background, var(--ion-background-color, #fff));
  border-radius: var(--app-radius-md, 16px);
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
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

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-tile {
  text-align: center;
  padding: 20px 10px;
}

.stat-tile ion-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.stat-tile h2 {
  margin: 0;
  font-size: 22px;
}

.stat-tile span {
  font-size: 12px;
  color: var(--ion-color-medium);
}

.completion-row {
  margin-bottom: 10px;
  font-size: 13.5px;
  font-weight: 500;
}

ion-progress-bar {
  border-radius: 4px;
  height: 7px;
}

.subject-progress-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.progress-item-head {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  margin-bottom: 6px;
}

.progress-item-head .pct {
  color: var(--ion-color-medium);
  font-weight: 600;
}

@media (min-width: 768px) {
  .stat-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
  `]
})
export class StatsPage {
  constructor(public data: MockDataService) {
    addIcons({ flameOutline, timeOutline, ribbonOutline, trendingUpOutline });
  }
}
