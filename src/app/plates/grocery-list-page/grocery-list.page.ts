import { Component, OnInit } from '@angular/core';
import { GroceryListService } from '../services/grocery-list.service';
import { GroceryListModel } from '../../_clients/models/GroceryListModel';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.page.html',
  styleUrls: ['./grocery-list.page.scss'],
})
export class GroceryListPage implements OnInit {
  groceryList: GroceryListModel | null = null;
  weekStartDate: string;
  weekLabel: string;
  loading = false;

  constructor(
    private groceryListService: GroceryListService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.weekStartDate = this.getMonday(new Date());
    this.weekLabel = this.formatWeekLabel(this.weekStartDate);
    this.loadGroceryList();
  }

  private getMonday(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  }

  private formatWeekLabel(dateStr: string): string {
    return dateStr;
  }

  private loadGroceryList() {
    this.loading = true;
    this.groceryListService.getGroceryList(this.weekStartDate).subscribe({
      next: (list) => {
        this.groceryList = list;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  public onWeekChange(direction: 'prev' | 'next') {
    const d = new Date(this.weekStartDate);
    d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
    this.weekStartDate = d.toISOString().split('T')[0];
    this.weekLabel = this.formatWeekLabel(this.weekStartDate);
    this.loadGroceryList();
  }

  public toggleItem(item: { id: string; checked: boolean }) {
    const newChecked = !item.checked;
    this.groceryListService.toggleItem(item.id, newChecked).subscribe({
      next: () => {
        item.checked = newChecked;
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: this.translate.instant('GROCERY_LIST.TOGGLE_FAILED'),
          duration: 2000
        });
        await toast.present();
      }
    });
  }

  public async regenerateList() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('GROCERY_LIST.REGENERATE'),
      message: this.translate.instant('GROCERY_LIST.REGENERATE_CONFIRM'),
      buttons: [
        { text: this.translate.instant('GROCERY_LIST.CANCEL'), role: 'cancel' },
        {
          text: this.translate.instant('GROCERY_LIST.CONFIRM'),
          handler: () => {
            this.loading = true;
            this.groceryListService.regenerateGroceryList(this.weekStartDate).subscribe({
              next: async (list) => {
                this.groceryList = list;
                this.loading = false;
                const toast = await this.toastCtrl.create({
                  message: this.translate.instant('GROCERY_LIST.REGENERATE_SUCCESS'),
                  duration: 2000
                });
                await toast.present();
              },
              error: async () => {
                this.loading = false;
                const toast = await this.toastCtrl.create({
                  message: this.translate.instant('GROCERY_LIST.REGENERATE_FAILED'),
                  duration: 2000
                });
                await toast.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}