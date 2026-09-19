import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonIcon,
  IonButton, IonChip, IonLabel, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, imageOutline, trashOutline, addOutline } from 'ionicons/icons';
import { MockDataService } from '../../services/mock-data.service';
import { AddMaterialModalComponent } from '../../components/add-material-modal/add-material-modal.component';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonIcon,
    IonButton, IonChip, IonLabel
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/study" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Materials</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openAddMaterial()"><ion-icon slot="icon-only" name="add-outline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="filter-row">
        <ion-chip [outline]="activeFilter() !== ''" [color]="activeFilter() === '' ? 'dark' : 'medium'" (click)="setFilter('')">
          <ion-label>All</ion-label>
        </ion-chip>
        @for (s of data.subjects(); track s.id) {
          <ion-chip [outline]="activeFilter() !== s.id" [color]="activeFilter() === s.id ? 'dark' : 'medium'" (click)="setFilter(s.id)">
            <ion-label>{{ s.name }}</ion-label>
          </ion-chip>
        }
      </div>

      <div class="soft-card materials-card">
        @for (m of filtered(); track m.id) {
          <div class="material-row">
            <ion-icon [name]="m.kind === 'image' ? 'image-outline' : 'document-text-outline'"
                      [style.color]="m.kind === 'image' ? '#6C63FF' : '#EB5757'"></ion-icon>
            <div class="material-text">
              <p>{{ m.name }}</p>
              <span>{{ subjectName(m.subjectId) }} &middot; {{ m.size }}</span>
            </div>
            <ion-icon name="trash-outline" class="delete-icon" (click)="remove(m.id)"></ion-icon>
          </div>
        } @empty {
          <div class="empty-state"><p>No materials in this subject yet.</p></div>
        }
      </div>
    </ion-content>
  `,
  styles: [`
    .filter-row { display: flex; gap: 8px; overflow-x: auto; padding: 4px 2px 16px; }
    ion-chip { flex-shrink: 0; margin: 0; }
    .materials-card { display: flex; flex-direction: column; gap: 16px; }
    .material-row { display: flex; align-items: center; gap: 12px; }
    .material-row ion-icon:first-child { font-size: 22px; flex-shrink: 0; }
    .material-text { flex: 1; min-width: 0; }
    .material-text p { margin: 0; font-size: 14px; font-weight: 500; }
    .material-text span { font-size: 11.5px; color: var(--ion-color-medium); }
    .delete-icon { color: var(--ion-color-medium); font-size: 18px; cursor: pointer; }
  `]
})
export class MaterialsPage {
  activeFilter = signal('');

  constructor(public data: MockDataService, private route: ActivatedRoute, private modalCtrl: ModalController) {
    addIcons({ documentTextOutline, imageOutline, trashOutline, addOutline });
    const qp = this.route.snapshot.queryParamMap.get('subjectId');
    if (qp) this.activeFilter.set(qp);
  }

  filtered = computed(() => {
    const filter = this.activeFilter();
    return this.data.materials().filter((m) => !filter || m.subjectId === filter);
  });

  setFilter(id: string) {
    this.activeFilter.set(id);
  }

  subjectName(id: string) {
    return this.data.subjectById(id)?.name ?? '';
  }

  remove(id: string) {
    this.data.removeMaterial(id);
  }

  async openAddMaterial() {
    const modal = await this.modalCtrl.create({ component: AddMaterialModalComponent, breakpoints: [0, 0.95], initialBreakpoint: 0.95 });
    await modal.present();
  }
}
