import { Component, computed, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonFab, IonFabButton,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, chevronForward, addOutline, calendarClearOutline } from 'ionicons/icons';
import { MockDataService } from '../../services/mock-data.service';
import { AddQuizModalComponent } from '../../components/add-quiz-modal/add-quiz-modal.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonFab, IonFabButton],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="cal-header">
          <ion-button fill="clear" (click)="shiftWeek(-1)"><ion-icon name="chevron-back" slot="icon-only"></ion-icon></ion-button>
          <h2>{{ monthLabel() }}</h2>
          <ion-button fill="clear" (click)="shiftWeek(1)"><ion-icon name="chevron-forward" slot="icon-only"></ion-icon></ion-button>
        </div>
      </ion-toolbar>
      <div class="week-strip">
        @for (d of weekDays(); track d.date) {
          <div class="day-cell" [class.active]="d.date === selectedDate()" (click)="selectedDate.set(d.date)">
            <span class="dow">{{ d.dow }}</span>
            <span class="dom">{{ d.dom }}</span>
          </div>
        }
      </div>
    </ion-header>

    <ion-content class="ion-padding">
  <div class="calendar-container">
    <h3 class="date-heading">{{ selectedDateLabel() }}</h3>

    <div class="timeline">
      @for (task of dayTasks(); track task.id) {
        <div class="timeline-row">
          <span class="time-label">{{ task.startTime }}</span>
          <div
            class="soft-card task-block"
            [style.borderLeftColor]="subjectColor(task.subjectId)"
          >
            <p class="task-title">{{ task.title }}</p>
            <span class="task-sub">
              {{ subjectName(task.subjectId) }}
              {{ task.endTime ? ' · ' + task.startTime + ' - ' + task.endTime : '' }}
            </span>
          </div>
        </div>
      } @empty {
        <div class="empty-state">
          <ion-icon name="calendar-clear-outline"></ion-icon>
          <p>No sessions scheduled this day.</p>
        </div>
      }
    </div>
  </div>
</ion-content>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button color="dark" (click)="openAddQuiz()">
        <ion-icon name="add-outline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styles: 

  [`
    .soft-card {
  background: var(--ion-card-background, var(--ion-background-color, #fff));
  border-radius: var(--app-radius-md, 16px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

    :host {
  display: block;
}

.calendar-container {
  max-width: 600px;
  margin: 0 auto;
}

.cal-header {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.week-strip {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 6px 14px 12px;
}

    .cal-header { display: flex; align-items: center; justify-content: space-between; padding: 0 4px; }
    .cal-header h2 { font-size: 16px; margin: 0; }
    .week-strip { display: flex; justify-content: space-between; padding: 6px 14px 12px; }
    .day-cell {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 8px 0; width: 38px; border-radius: 12px; cursor: pointer;
    }
    .day-cell .dow { font-size: 10px; color: var(--ion-color-medium); }
    .day-cell .dom { font-size: 14px; font-weight: 600; }
    .day-cell.active { background: var(--ion-color-dark); }
    .day-cell.active .dow, .day-cell.active .dom { color: #fff; }

    .date-heading { font-size: 15px; margin: 4px 4px 16px; color: var(--ion-color-medium); font-weight: 500; }
    .timeline { display: flex; flex-direction: column; gap: 14px; }
    .timeline-row { display: flex; gap: 12px; align-items: flex-start; }
    .time-label { width: 66px; flex-shrink: 0; font-size: 12px; color: var(--ion-color-medium); padding-top: 14px; }
    .task-block { flex: 1; border-left: 4px solid var(--ion-color-secondary); padding: 12px 14px; }
    .task-title { margin: 0 0 2px; font-size: 14px; font-weight: 600; }
    .task-sub { font-size: 12px; color: var(--ion-color-medium); }
  `]
})
export class CalendarPage {
  selectedDate = signal(this.data.today());
  weekOffset = signal(0);

  constructor(public data: MockDataService, private modalCtrl: ModalController) {
    addIcons({ chevronBack, chevronForward, addOutline, calendarClearOutline });
  }

  weekDays = computed(() => {
    const base = new Date();
    base.setDate(base.getDate() - base.getDay() + this.weekOffset() * 7);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push({
        date: d.toISOString().split('T')[0],
        dow: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        dom: d.getDate()
      });
    }
    return days;
  });

  monthLabel = computed(() => {
    const first = this.weekDays()[0];
    return new Date(first.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  });

  selectedDateLabel = computed(() =>
    new Date(this.selectedDate()).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
  );

  dayTasks = computed(() => this.data.tasksForDate(this.selectedDate()));

  shiftWeek(dir: number) {
    this.weekOffset.update((v) => v + dir);
  }

  subjectName(id: string) {
    return this.data.subjectById(id)?.name ?? '';
  }

  subjectColor(id: string) {
    return this.data.subjectById(id)?.color ?? '#6C63FF';
  }

  async openAddQuiz() {
    const modal = await this.modalCtrl.create({ component: AddQuizModalComponent, breakpoints: [0, 0.95], initialBreakpoint: 0.95 });
    await modal.present();
  }
}
