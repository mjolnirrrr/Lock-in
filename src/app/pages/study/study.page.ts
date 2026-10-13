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
  templateUrl: './study.page.html',
  styleUrl: './study.page.scss'
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