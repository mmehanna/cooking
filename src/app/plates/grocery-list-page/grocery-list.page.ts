import { Component, OnInit } from '@angular/core';
import { GroceryListClient } from '../../_clients/grocery-list.client';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.page.html',
  styleUrls: ['./grocery-list.page.scss'],
})
export class GroceryListPage implements OnInit {
  manualItems: any[] = [];
  weekStartDate: string;
  weekLabel: string;
  minWeekStartDate: string;
  maxWeekStartDate: string;
  loading = false;
  newItemName = '';
  newItemQty = '';
  newItemQtyUnit = '';
  showDetails = false;

  chefItems: any[] = [];
  chefName = '';
  isCurrentUserChef = true;

  constructor(
    private groceryListClient: GroceryListClient,
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
    this.loadManualItems();
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

  private loadManualItems() {
    this.loading = true;
    this.groceryListClient.getManualItems(this.weekStartDate).subscribe({
      next: (items) => {
        this.manualItems = items;
        this.loadChefItems();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private loadChefItems() {
    this.groceryListClient.getChefGroceryList(this.weekStartDate).subscribe({
      next: (data) => {
        this.chefItems = data.items;
        this.chefName = data.chefName;
        this.isCurrentUserChef = data.isCurrentUserChef;
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
    this.loadManualItems();
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

  public async quickAddItem() {
    const name = this.newItemName.trim();
    if (!name) {
      const toast = await this.toastCtrl.create({
        message: 'Entrez un nom pour l\'article.', duration: 2000, color: 'warning'
      });
      await toast.present();
      return;
    }

    this.groceryListClient.createManualItem({
      name,
      quantity: this.newItemQty || undefined,
      unit: this.newItemQtyUnit || undefined,
      weekStartDate: this.weekStartDate
    }).subscribe({
      next: () => {
        this.newItemName = '';
        this.newItemQty = '';
        this.newItemQtyUnit = '';
        this.showDetails = false;
        this.loadManualItems();
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Erreur lors de l\'ajout', duration: 2000, color: 'danger'
        });
        await toast.present();
      }
    });
  }


  public async editManualItem(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Modifier l\'article',
      inputs: [
        { name: 'name', type: 'text', value: item.name, placeholder: 'Nom' },
        { name: 'quantity', type: 'text', value: item.quantity || '', placeholder: 'Quantité' },
        { name: 'unit', type: 'text', value: item.unit || '', placeholder: 'Unité' }
      ],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Enregistrer',
          handler: (data) => {
            this.groceryListClient.updateManualItem(item.id, {
              name: data.name,
              quantity: data.quantity,
              unit: data.unit
            }).subscribe({
              next: () => this.loadManualItems(),
              error: async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Erreur lors de la modification', duration: 2000, color: 'danger'
                });
                await toast.present();
              }
            });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  public async deleteManualItem(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Supprimer',
      message: `Supprimer "${item.name}" ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          handler: () => {
            this.groceryListClient.deleteManualItem(item.id).subscribe({
              next: () => this.loadManualItems(),
              error: async () => {
                const toast = await this.toastCtrl.create({
                  message: 'Erreur lors de la suppression', duration: 2000, color: 'danger'
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

  public toggleManualItem(item: any) {
    const newChecked = !item.checked;
    this.groceryListClient.updateManualItem(item.id, { checked: newChecked }).subscribe({
      next: () => { item.checked = newChecked; },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: this.translate.instant('GROCERY_LIST.TOGGLE_FAILED'), duration: 2000
        });
        await toast.present();
      }
    });
  }

  public get hasManualItems(): boolean {
    return this.manualItems.length > 0;
  }

  public get hasChefItems(): boolean {
    return this.chefItems.length > 0;
  }
}
