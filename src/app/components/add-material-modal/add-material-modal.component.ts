import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
  IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonSelect, IonSelectOption,
  ModalController, Platform
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline, cloudUploadOutline, documentTextOutline, imageOutline,
  linkOutline, closeCircle
} from 'ionicons/icons';
import { MockDataService } from '../../services/mock-data.service';

interface StagedFile {
  name: string;
  size: string;
  kind: 'pdf' | 'image' | 'doc';
}

@Component({
  selector: 'app-add-material-modal',
  standalone: true,
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
    IonSegment, IonSegmentButton, IonLabel, IonList, IonItem, IonSelect, IonSelectOption
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Add Materials</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()"><ion-icon name="close-outline" slot="icon-only"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-segment [(ngModel)]="activeTab" class="tab-segment">
        <ion-segment-button value="files"><ion-label>Files</ion-label></ion-segment-button>
        <ion-segment-button value="images"><ion-label>Images</ion-label></ion-segment-button>
        <ion-segment-button value="links"><ion-label>Links</ion-label></ion-segment-button>
      </ion-segment>

      <ion-item class="form-field" lines="none" style="margin-top:16px;">
        <ion-select
          label="Subject" labelPlacement="stacked" placeholder="Select subject"
          [interface]="subjectInterface" [interfaceOptions]="subjectInterfaceOptions"
          [(ngModel)]="subjectId">
          @for (s of subjects(); track s.id) {
            <ion-select-option [value]="s.id">{{ s.name }}</ion-select-option>
          }
        </ion-select>
      </ion-item>

      <div class="upload-box" (click)="simulateBrowse()">
        <ion-icon name="cloud-upload-outline"></ion-icon>
        <p>Drag and drop files here</p>
        <span>or</span>
        <ion-button size="small" fill="outline" color="dark" class="browse-btn" (click)="simulateBrowse()">
          Browse Files
        </ion-button>
      </div>

      <p class="section-label">Recent Files</p>
      <ion-list lines="full" class="file-list">
        @for (f of stagedFiles(); track f.name) {
          <ion-item>
            <ion-icon [name]="iconFor(f.kind)" slot="start" [style.color]="colorFor(f.kind)"></ion-icon>
            <ion-label>
              <h3>{{ f.name }}</h3>
              <p>{{ f.kind.toUpperCase() }} &middot; {{ f.size }}</p>
            </ion-label>
            <ion-icon name="close-circle" slot="end" (click)="removeFile(f)" class="remove-icon"></ion-icon>
          </ion-item>
        }
        @empty {
          <div class="empty-state">
            <p>No files added yet</p>
          </div>
        }
      </ion-list>

      <ion-button expand="block" color="dark" class="full-width-btn done-btn" (click)="done()" [disabled]="!stagedFiles().length || !subjectId">
        Done
      </ion-button>
    </ion-content>
  `,
  styles: [`
    .tab-segment { --background: var(--ion-color-light); border-radius: var(--app-radius-md); }

    .form-field {
      border-radius: 8px;
      overflow: hidden;
    }

    .upload-box {
      border: 1.5px dashed var(--ion-color-light-shade);
      border-radius: var(--app-radius-lg);
      text-align: center;
      padding: 34px 12px;
      margin: 18px 0 10px;
      cursor: pointer;

      ion-icon { font-size: 34px; color: var(--ion-color-medium); margin-bottom: 8px; }
      p { margin: 0; font-size: 14px; font-weight: 500; }
      span { font-size: 12px; color: var(--ion-color-medium); display: block; margin: 4px 0; }
    }
    .browse-btn { margin-top: 6px; --border-radius: var(--app-radius-sm); text-transform: none; }
    .section-label { font-size: 13px; color: var(--ion-color-medium); margin: 18px 0 4px; }
    .file-list { background: transparent; }
    .file-list ion-item {
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .remove-icon { color: var(--ion-color-medium); font-size: 20px; cursor: pointer; }
    .done-btn { margin-top: 22px; margin-bottom: 20px; }

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
export class AddMaterialModalComponent {
  activeTab: 'files' | 'images' | 'links' = 'files';
  subjectId = '';
  subjects;
  stagedFiles = signal<StagedFile[]>([
    { name: 'Calculus Notes.pdf', size: '2.4 MB', kind: 'pdf' },
    { name: 'Graph Example.png', size: '1.1 MB', kind: 'image' },
    { name: 'Formula Sheet.docx', size: '320 KB', kind: 'doc' }
  ]);

  subjectInterface: 'popover' | 'action-sheet' = 'action-sheet';
  subjectInterfaceOptions: any = {};

  private mockFileNames = [
    'Lecture Slides.pdf', 'Lab Diagram.png', 'Homework Notes.docx',
    'Practice Problems.pdf', 'Reference Chart.png'
  ];

  constructor(private modalCtrl: ModalController, private data: MockDataService, private platform: Platform) {
    addIcons({ closeOutline, cloudUploadOutline, documentTextOutline, imageOutline, linkOutline, closeCircle });
    this.subjects = this.data.subjects;

    if (this.platform.is('ios')) {
      this.subjectInterface = 'popover';
      this.subjectInterfaceOptions = { cssClass: 'subject-popover-ios' };
    } else {
      this.subjectInterface = 'action-sheet';
      this.subjectInterfaceOptions = { cssClass: 'subject-sheet-android' };
    }
  }

  iconFor(kind: StagedFile['kind']) {
    return kind === 'pdf' ? 'document-text-outline' : kind === 'image' ? 'image-outline' : 'document-text-outline';
  }

  colorFor(kind: StagedFile['kind']) {
    return kind === 'pdf' ? '#EB5757' : kind === 'image' ? '#6C63FF' : '#2ECC71';
  }

  simulateBrowse() {
    const kinds: StagedFile['kind'][] = ['pdf', 'image', 'doc'];
    const name = this.mockFileNames[Math.floor(Math.random() * this.mockFileNames.length)];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const size = `${(Math.random() * 3 + 0.2).toFixed(1)} MB`;
    this.stagedFiles.update((list) => [{ name, size, kind }, ...list]);
  }

  removeFile(f: StagedFile) {
    this.stagedFiles.update((list) => list.filter((x) => x !== f));
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  done() {
    for (const f of this.stagedFiles()) {
      this.data.addMaterial({
        name: f.name,
        subjectId: this.subjectId,
        kind: f.kind,
        size: f.size
      });
    }
    this.modalCtrl.dismiss({ added: true }, 'confirm');
  }
}