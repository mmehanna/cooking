import { Component, OnInit } from '@angular/core';
import { GroceryListService } from '../services/grocery-list.service';
import { GroceryListModel } from '../../_clients/models/GroceryListModel';
import { GroceryItemModel, GroceryListGroupItemModel } from '../../_clients/models/GroceryItemModel';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.page.html',
  styleUrls: ['./grocery-list.page.scss'],
})
export class GroceryListPage implements OnInit {
  groceryList: GroceryListModel | null = null;
  weekStartDate: string;
  weekLabel: string;
  minWeekStartDate: string;
  maxWeekStartDate: string;
  loading = false;

  constructor(
    private groceryListService: GroceryListService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);

    this.minWeekStartDate = this.getMonday(new Date());
    this.maxWeekStartDate = this.getMonday(maxDate);
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
    const d = new Date(`${this.weekStartDate}T00:00:00`);
    d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
    const nextWeekStartDate = d.toISOString().split('T')[0];

    if (nextWeekStartDate < this.minWeekStartDate || nextWeekStartDate > this.maxWeekStartDate) {
      return;
    }

    this.weekStartDate = nextWeekStartDate;
    this.weekLabel = this.formatWeekLabel(this.weekStartDate);
    this.loadGroceryList();
  }

  public get canGoPreviousWeek(): boolean {
    return this.weekStartDate > this.minWeekStartDate;
  }

  public get canGoNextWeek(): boolean {
    return this.weekStartDate < this.maxWeekStartDate;
  }

  public getWeekdayLabel(date: string): string {
    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
    return new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(parsedDate);
  }

  public get hasGroceryGroups(): boolean {
    return (this.groceryList?.groups?.length ?? 0) > 0;
  }

  public toggleItem(item: GroceryItemModel) {
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

  public toggleGroupItem(item: GroceryListGroupItemModel) {
    if (!item.groceryItemId) {
      return;
    }

    const newChecked = !item.checked;
    this.groceryListService.toggleItem(item.groceryItemId, newChecked).subscribe({
      next: () => {
        item.checked = newChecked;
        this.groceryList?.items
          ?.filter(groceryItem => groceryItem.id === item.groceryItemId)
          .forEach(groceryItem => groceryItem.checked = newChecked);
        this.groceryList?.groups
          ?.forEach(group => {
            group.items
              .filter(groupItem => groupItem.groceryItemId === item.groceryItemId)
              .forEach(groupItem => groupItem.checked = newChecked);
          });
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
