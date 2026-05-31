import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { WorldwideRecipeClient } from '../_clients/worldwide-recipe.client';
import { PlateClient } from '../_clients/plate.client';
import { PlateForCreationDto } from '../plates/choose-plate-page/dtos/plate-for-creation.dto';
import { WorldwideRecipeModel, WorldwideRecipeRegionModel } from '../_clients/models/WorldwideRecipeModel';

@Component({
  selector: 'app-worldwide-recipes',
  templateUrl: './worldwide-recipes.page.html',
  styleUrls: ['./worldwide-recipes.page.scss'],
})
export class WorldwideRecipesPage implements OnInit {
  public regions: WorldwideRecipeRegionModel[] = [];
  public popularRecipes: WorldwideRecipeModel[] = [];
  public loading = true;
  public loadingPopular = true;

  private readonly regionIcons: Record<string, string> = {
    americas: 'compass-outline',
    europe: 'cafe-outline',
    asia: 'flower-outline',
    africa: 'sunny-outline',
    oceania: 'boat-outline',
  };

  private readonly regionEmojis: Record<string, string> = {
    americas: '🌎',
    europe: '🌍',
    asia: '🌏',
    africa: '🦁',
    oceania: '🐠',
  };

  constructor(
    private worldwideRecipeClient: WorldwideRecipeClient,
    private plateClient: PlateClient,
    private toastController: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
    this.loadPopularRecipes();
  }

  public loadRecipes(event?: any): void {
    this.loading = !event;
    this.worldwideRecipeClient.getWorldwideRecipes().subscribe({
      next: (regions) => {
        this.regions = regions;
        this.loading = false;
        event?.target?.complete();
      },
      error: () => {
        this.loading = false;
        event?.target?.complete();
      },
    });
  }

  public loadPopularRecipes(): void {
    this.loadingPopular = true;
    this.worldwideRecipeClient.getPopularRecipes(15).subscribe({
      next: (recipes) => {
        this.popularRecipes = recipes.map((r, i) => ({ ...r, rank: i + 1 }));
        this.loadingPopular = false;
      },
      error: () => {
        this.loadingPopular = false;
      },
    });
  }

  public getRegionIcon(region: string): string {
    return this.regionIcons[region.toLowerCase()] || 'earth-outline';
  }

  public getRegionEmoji(region: string): string {
    return this.regionEmojis[region.toLowerCase()] || '🌐';
  }

  public getTotalRecipes(): number {
    return this.regions.reduce((sum, r) => sum + r.recipes.length, 0);
  }

  public async addRecipeToPlates(recipe: WorldwideRecipeModel): Promise<void> {
    const dto = new PlateForCreationDto(recipe.name, '', '');
    this.plateClient.createPlate(dto).subscribe({
      next: async () => {
        const message = this.translate.instant('WORLDWIDE_RECIPES.ADD_SUCCESS', { label: recipe.name });
        const toast = await this.toastController.create({
          message,
          duration: 2000,
          position: 'bottom',
          color: 'success',
        });
        await toast.present();
      },
      error: async () => {
        const message = this.translate.instant('WORLDWIDE_RECIPES.ADD_FAILED');
        const toast = await this.toastController.create({
          message,
          duration: 2000,
          position: 'bottom',
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}
