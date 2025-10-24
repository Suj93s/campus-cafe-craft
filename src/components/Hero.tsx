import heroImage from '@/assets/cafe-hero.jpg';

export const Hero = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="relative container mx-auto h-full flex items-center px-4">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Order Fresh Campus <br />
            <span className="text-accent">Café Snacks Online</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Quick bites and cool sips — ready when you are.
          </p>
          <button onClick={scrollToMenu} className="cafe-accent-button text-lg">
            Start Ordering
          </button>
        </div>
      </div>
    </section>
  );
};
