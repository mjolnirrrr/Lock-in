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
  templateUrl: './stats.page.html',
  styleUrl: './stats.page.scss'
})
export class StatsPage {
  constructor(public data: MockDataService) {
    addIcons({ flameOutline, timeOutline, ribbonOutline, trendingUpOutline });
  }
}