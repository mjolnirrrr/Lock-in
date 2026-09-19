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
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Add Quiz / Activity</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()"><ion-icon name="close-outline" slot="icon-only"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item class="form-field" lines="none">
        <ion-input label="Title" labelPlacement="stacked" placeholder="Enter title" [(ngModel)]="title"></ion-input>
      </ion-item>

      <ion-item class="form-field" lines="none">
        <ion-select
          label="Subject" labelPlacement="stacked" placeholder="Select subject"
          [interface]="subjectInterface" [interfaceOptions]="subjectInterfaceOptions"
          [(ngModel)]="subjectId">
          @for (s of subjects(); track s.id) {
            <ion-select-option [value]="s.id">{{ s.name }}</ion-select-option>
          }
        </ion-select>
      </ion-item>

      <p class="field-label">Type</p>
      <ion-segment [(ngModel)]="type" class="type-segment">
        <ion-segment-button value="quiz">
          <ion-label>Quiz</ion-label>
        </ion-segment-button>
        <ion-segment-button value="activity">
          <ion-label>Activity</ion-label>
        </ion-segment-button>
      </ion-segment>

      <div class="row-2">
        <ion-item class="form-field" lines="none">
          <ion-input label="Date" labelPlacement="stacked" type="date" [(ngModel)]="date"></ion-input>
        </ion-item>
        <ion-item class="form-field" lines="none">
          <ion-input label="Time" labelPlacement="stacked" type="time" [(ngModel)]="time"></ion-input>
        </ion-item>
      </div>

      <ion-item class="form-field" lines="none">
        <ion-textarea label="Description (optional)" labelPlacement="stacked"
                       placeholder="Add a description..." [(ngModel)]="description" [autoGrow]="true"></ion-textarea>
      </ion-item>

      <p class="field-label">Materials</p>
      <div class="upload-box">
        <ion-icon name="cloud-upload-outline"></ion-icon>
        <p>Add files or images</p>
        <span>Supports PDF, DOC, PPT, Images (JPG, PNG)</span>
      </div>

      <ion-button expand="block" color="dark" class="full-width-btn create-btn" (click)="create()" [disabled]="!title || !subjectId">
        Create
      </ion-button>
    </ion-content>
  `,
  styles: [`
    .field-label { font-size: 13px; color: var(--ion-color-medium); margin: 4px 0 8px; }
    .type-segment { margin-bottom: 16px; --background: var(--ion-color-light); border-radius: var(--app-radius-md); }
    .row-2 { display: flex; gap: 12px; }
    .row-2 ion-item { flex: 1; }
    .upload-box {
      border: 1.5px dashed var(--ion-color-light-shade);
      border-radius: var(--app-radius-md);
      text-align: center;
      padding: 22px 12px;
      margin-bottom: 20px;

      ion-icon { font-size: 28px; color: var(--ion-color-medium); margin-bottom: 6px; }
      p { margin: 0; font-size: 14px; font-weight: 500; }
      span { font-size: 11px; color: var(--ion-color-medium); }
    }
    .create-btn { margin-bottom: 20px; }

    /* --- Subject picker: iOS popover polish --- */
    ::ng-deep .subject-popover-ios {
      --width: 260px;
      --border-radius: 14px;
      --box-shadow: 0 10px 30px rgba(28, 28, 30, 0.14);
    }
    ::ng-deep .subject-popover-ios ion-list {
      padding: 6px 0;
    }
    ::ng-deep .subject-popover-ios ion-item {
      --min-height: 44px;
      font-size: 15px;
      --background-hover: var(--ion-color-light);
    }
    ::ng-deep .subject-popover-ios ion-radio {
      --color-checked: var(--ion-color-secondary);
    }

    /* --- Subject picker: Android action-sheet polish --- */
    ::ng-deep .subject-sheet-android .action-sheet-group {
      border-radius: 18px 18px 0 0;
      padding-top: 6px;
    }
    ::ng-deep .subject-sheet-android .action-sheet-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--ion-color-medium);
    }
    ::ng-deep .subject-sheet-android .action-sheet-button {
      font-size: 15.5px;
      color: var(--ion-color-dark);
    }
    ::ng-deep .subject-sheet-android .action-sheet-selected {
      color: var(--ion-color-secondary);
      font-weight: 600;
    }
    ::ng-deep .subject-sheet-android .action-sheet-cancel {
      font-weight: 600;
    }
  `]
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