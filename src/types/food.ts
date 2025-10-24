export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'snacks' | 'beverages';
}

export interface CartItem extends FoodItem {
  quantity: number;
}
