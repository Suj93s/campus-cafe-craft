import { FoodItem } from '@/types/food';
import uzhunnuVada from '@/assets/uzhunnu-vada.jpg';
import cutlet from '@/assets/cutlet.jpg';
import creamBun from '@/assets/cream-bun.jpg';
import chickenPuff from '@/assets/chicken-puff.jpg';
import laysRed from '@/assets/lays-red.jpg';
import darkFantasy from '@/assets/dark-fantasy.jpg';
import mangoLassi from '@/assets/mango-lassi.jpg';
import tea from '@/assets/tea.jpg';
import coffee from '@/assets/coffee.jpg';
import blackTea from '@/assets/black-tea.jpg';
import smoodhCaramel from '@/assets/smoodh-caramel.jpg';
import smoodhHazelnut from '@/assets/smoodh-hazelnut.jpg';

export const foodItems: FoodItem[] = [
  // Snacks
  {
    id: 'uzhunnu-vada',
    name: 'Uzhunnu Vada',
    price: 10,
    image: uzhunnuVada,
    category: 'snacks',
  },
  {
    id: 'cutlet',
    name: 'Cutlet',
    price: 15,
    image: cutlet,
    category: 'snacks',
  },
  {
    id: 'cream-bun',
    name: 'Cream Bun',
    price: 20,
    image: creamBun,
    category: 'snacks',
  },
  {
    id: 'chicken-puff',
    name: 'Chicken Puffs',
    price: 25,
    image: chickenPuff,
    category: 'snacks',
  },
  {
    id: 'lays-red',
    name: 'Lays (Red)',
    price: 20,
    image: laysRed,
    category: 'snacks',
  },
  {
    id: 'dark-fantasy',
    name: 'Dark Fantasy',
    price: 10,
    image: darkFantasy,
    category: 'snacks',
  },
  // Beverages
  {
    id: 'mango-lassi',
    name: 'Amul Mango Lassi',
    price: 30,
    image: mangoLassi,
    category: 'beverages',
  },
  {
    id: 'tea',
    name: 'Tea',
    price: 10,
    image: tea,
    category: 'beverages',
  },
  {
    id: 'coffee',
    name: 'Coffee',
    price: 15,
    image: coffee,
    category: 'beverages',
  },
  {
    id: 'black-tea',
    name: 'Black Tea',
    price: 10,
    image: blackTea,
    category: 'beverages',
  },
  {
    id: 'smoodh-caramel',
    name: 'Smoodh Caramel',
    price: 25,
    image: smoodhCaramel,
    category: 'beverages',
  },
  {
    id: 'smoodh-hazelnut',
    name: 'Smoodh Hazelnut',
    price: 25,
    image: smoodhHazelnut,
    category: 'beverages',
  },
];
