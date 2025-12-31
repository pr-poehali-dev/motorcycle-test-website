import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Products() {
  const products = [
    {
      category: 'Для всех фильмов',
      items: [
        { name: '3D очки', price: 150, emoji: '🥽' },
        { name: 'Попкорн большой', price: 200, emoji: '🍿' },
        { name: 'Напиток 0.5л', price: 100, emoji: '🥤' },
        { name: 'Набор конфет', price: 180, emoji: '🍬' }
      ]
    },
    {
      category: 'История Уилсона (эксклюзив)',
      items: [
        { name: 'Эксклюзивные наушники', price: 300, emoji: '🎧' },
        { name: 'Комбо "Уилсон"', price: 350, emoji: '🌭' },
        { name: 'Постер фильма', price: 250, emoji: '🖼️' }
      ]
    },
    {
      category: 'На весёлых поездах (эксклюзив)',
      items: [
        { name: 'VIP наушники с шумоподавлением', price: 500, emoji: '🎧' },
        { name: 'Комбо "Гонщик"', price: 450, emoji: '🍔' },
        { name: 'Мерч-набор', price: 600, emoji: '👕' }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 text-glow">Товары</h1>
        <p className="text-xl text-muted-foreground">
          Дополнительные товары для полного погружения в киноопыт
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {products.map((category, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold mb-4 text-glow-sm">{category.category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.items.map((item, itemIndex) => (
                <Card
                  key={itemIndex}
                  className="p-6 hover:scale-105 transition-transform text-center"
                >
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    {item.price} ₽
                  </Badge>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="max-w-2xl mx-auto p-8 mt-12 text-center bg-accent">
        <div className="text-4xl mb-4">ℹ️</div>
        <h3 className="text-xl font-bold mb-3 text-glow-sm">Как приобрести</h3>
        <p className="text-muted-foreground">
          Эксклюзивные товары доступны при бронировании билетов на соответствующий фильм. 
          Обычные товары можно добавить к любому заказу.
        </p>
      </Card>
    </div>
  );
}
