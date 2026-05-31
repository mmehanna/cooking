import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorldwideRecipeModel, WorldwideRecipeRegionModel } from './models/WorldwideRecipeModel';

@Injectable({ providedIn: 'root' })
export class WorldwideRecipeClient {
  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  public getWorldwideRecipes(): Observable<WorldwideRecipeRegionModel[]> {
    return this.httpClient.get<WorldwideRecipeRegionModel[]>(`${this.apiUrl}/worldwide-recipes`);
  }

  public getPopularRecipes(limit = 20): Observable<WorldwideRecipeModel[]> {
    return this.httpClient.get<WorldwideRecipeModel[]>(`${this.apiUrl}/worldwide-recipes/popular?limit=${limit}`);
  }
}
