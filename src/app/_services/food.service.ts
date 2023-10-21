import { Injectable } from "@angular/core";
import { FoodInterface } from "../tab-recipes/interfaces/food.interface";
import { UUID } from "angular2-uuid";

@Injectable({providedIn: 'root'})
export class FoodService {

  public foodList: FoodInterface[] = [
    {
      id: UUID.UUID(),
      isSelected: false,
      label: 'dumpling',
      details: {
        imgUrl: 'https://media.istockphoto.com/id/1133151212/photo/japanese-dumplings-gyoza-with-pork-meat-and-vegetables.jpg?s=2048x2048&w=is&k=20&c=G6L2OiAilguiWShRapJG9ZYG9Bud9uGNAo3vH62_ezU=',
        description: 'tasty dumpling'
      }
    },
    {
      id: UUID.UUID(),
      isSelected: false,
      label: 'burger',
      details: {
        imgUrl: 'https://media.istockphoto.com/id/520410807/photo/cheeseburger.jpg?s=612x612&w=is&k=20&c=ZjgZqXTNsiP074Aic-CdNA2GgEVGYmqrkQ-IoWfc0BY=',
        description: 'tasty burger'
      }

    },
    {
      id: UUID.UUID(),
      isSelected: false,
      label: 'sandwich',
      details: {
        imgUrl: 'https://media.istockphoto.com/id/1499248214/photo/the-viral-chopped-italian-sub-sandwich.jpg?s=1024x1024&w=is&k=20&c=9WF2KxDZ14lvmHCOhn-jOImKEzTa1tV9PI9jNzwA5Ws=',
        description: 'tasty sandwich'
      }

    }
  ];

  public getFoods(): FoodInterface[] {
    return this.foodList;
  }

  public getFoodDetails(id: UUID): FoodInterface | undefined {
    return this.foodList.find(recipe => recipe.id === id);
  }

  public toggleFoodSelection(id: UUID) {
    const currentFood = this.getFoodDetails(id);

    if (!currentFood) {
      return;
    }

    currentFood.isSelected = !currentFood.isSelected;
    console.table(this.foodList);
  }

}
