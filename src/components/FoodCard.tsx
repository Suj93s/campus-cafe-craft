import { Minus, Plus } from 'lucide-react';
import { FoodItem } from '@/types/food';
import { useCart } from '@/contexts/CartContext';

interface FoodCardProps {
  item: FoodItem;
}

export const FoodCard = ({ item }: FoodCardProps) => {
  const { cart, addToCart, removeFromCart } = useCart();
  const cartItem = cart.find((cartItem) => cartItem.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="cafe-card overflow-hidden">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-foreground">{item.name}</h3>
        <p className="text-2xl font-bold text-primary mb-4">₹{item.price}</p>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => removeFromCart(item.id)}
            disabled={quantity === 0}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="text-xl font-semibold text-foreground min-w-[2rem] text-center">
            {quantity}
          </span>

          <button
            onClick={() => addToCart(item)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-all hover:bg-accent/90"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
