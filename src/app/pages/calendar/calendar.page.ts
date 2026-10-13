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
  templateUrl: './calendar.page.html',
  styleUrl: './calendar.page.scss'
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