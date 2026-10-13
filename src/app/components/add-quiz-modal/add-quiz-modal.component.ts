import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
  IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, IonSegment, IonSegmentButton,
  IonLabel, ModalController, Platform
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, cloudUploadOutline } from 'ionicons/icons';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-add-quiz-modal',
  standalone: true,
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
    IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea, IonSegment, IonSegmentButton, IonLabel
  ],
  templateUrl: './add-quiz-modal.component.html',
  styleUrl: './add-quiz-modal.component.scss'
})
export class AddQuizModalComponent {
  title = '';
  subjectId = '';
  type: 'quiz' | 'activity' = 'quiz';
  date = new Date().toISOString().split('T')[0];
  time = '14:00';
  description = '';

  subjects;
  subjectInterface: 'popover' | 'action-sheet' = 'action-sheet';
  subjectInterfaceOptions: any = {};

  constructor(private modalCtrl: ModalController, private data: MockDataService, private platform: Platform) {
    addIcons({ closeOutline, cloudUploadOutline });
    this.subjects = this.data.subjects;

    if (this.platform.is('ios')) {
      this.subjectInterface = 'popover';
      this.subjectInterfaceOptions = { cssClass: 'subject-popover-ios' };
    } else {
      this.subjectInterface = 'action-sheet';
      this.subjectInterfaceOptions = { cssClass: 'subject-sheet-android' };
    }
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  create() {
    const [h, m] = this.time.split(':').map(Number);
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const period = h >= 12 ? 'PM' : 'AM';
    const startTime = `${hour12}:${m.toString().padStart(2, '0')} ${period}`;

    this.data.addTask({
      title: this.title,
      subjectId: this.subjectId,
      type: this.type,
      date: this.date,
      startTime,
      description: this.description || undefined
    });

    this.modalCtrl.dismiss({ created: true }, 'confirm');
  }
}