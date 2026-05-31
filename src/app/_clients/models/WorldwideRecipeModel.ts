export interface WorldwideRecipeModel {
  id: string;
  name: string;
  region?: string;
  popularityScore?: number;
}

export interface WorldwideRecipeRegionModel {
  region: string;
  recipes: WorldwideRecipeModel[];
}
