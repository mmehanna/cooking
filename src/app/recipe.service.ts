import { Injectable } from "@angular/core";
import { Recipe } from "./tab-recipes/recipe";
@Injectable()
export class RecipeService {

  protected  recipeList: Recipe[] = [
    {id: 1, selected: false, name: 'dumbling'},
    {id: 2, selected: false, name: 'burger'},
    {id: 3, selected: false, name: 'sandwich'}
  ];

  getAllRecipes(): Recipe[] {
    return this.recipeList;
  }

  getRecipe(id: number): Recipe | undefined {
    return this.recipeList.find(recipe => recipe.id === id);
  }

}
