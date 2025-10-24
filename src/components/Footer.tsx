import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="flex items-center justify-center gap-2 text-sm">
          © 2025 Saintgits Café Hub | Made with{' '}
          <Heart className="h-4 w-4 fill-accent text-accent" /> by Students
        </p>
      </div>
    </footer>
  );
};
