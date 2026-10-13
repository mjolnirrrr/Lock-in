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
  templateUrl: './add-material-modal.component.html',
  styleUrl: './add-material-modal.component.scss'
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