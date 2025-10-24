import { foodItems } from '@/data/foodItems';
import { FoodCard } from './FoodCard';

export const MenuSection = () => {
  const snacks = foodItems.filter((item) => item.category === 'snacks');
  const beverages = foodItems.filter((item) => item.category === 'beverages');

  return (
    <section id="menu" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div id="snacks" className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            Snacks 🍴
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Delicious bites to fuel your day
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {snacks.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div id="beverages">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
            Juice & Beverages 🥤
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Refreshing drinks to keep you energized
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {beverages.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
