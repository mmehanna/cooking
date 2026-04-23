import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { GroceryListModel } from "../../_clients/models/GroceryListModel";
import { GroceryListClient } from "../../_clients/grocery-list.client";

@Injectable({ providedIn: 'root' })
export class GroceryListService {
  private groceryListSubject = new BehaviorSubject<GroceryListModel | null>(null);
  groceryList$ = this.groceryListSubject.asObservable();

  constructor(private groceryListClient: GroceryListClient) {}

  public getGroceryList(weekStartDate: string): Observable<GroceryListModel> {
    return this.groceryListClient.getGroceryList(weekStartDate).pipe(
      tap(list => this.groceryListSubject.next(list))
    );
  }

  public regenerateGroceryList(weekStartDate: string): Observable<GroceryListModel> {
    return this.groceryListClient.regenerateGroceryList(weekStartDate).pipe(
      tap(list => this.groceryListSubject.next(list))
    );
  }

  public toggleItem(itemId: string, checked: boolean): Observable<any> {
    return this.groceryListClient.toggleGroceryItem(itemId, checked);
  }
}