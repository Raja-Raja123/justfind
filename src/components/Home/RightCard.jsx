const cards = [
  {
    title: "B2B",
    subtitle: "Quick Quotes",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
  },
  {
    title: "Repairs & Services",
    subtitle: "Get Nearest Vendor",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
  },
  {
    title: "Real Estate",
    subtitle: "Finest Agents",
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
  },
  {
    title: "Doctors",
    subtitle: "Book Now",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
  },
];

export default function RightCard() {
  return (
    <div className="grid grid-cols-2 gap-4 h-[320px]">
      {cards.map((card, i) => (
        <div key={i} className="relative rounded-xl overflow-hidden">
          <img src={card.image} className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-black/50 p-3 flex flex-col justify-end">
            <h3 className="text-white font-semibold">{card.title}</h3>
            <p className="text-gray-200 text-sm">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}