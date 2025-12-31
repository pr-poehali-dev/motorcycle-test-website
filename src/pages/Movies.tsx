import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Movie } from '../App';

type MoviesProps = {
  onMovieSelect: (movie: Movie) => void;
  quizCompleted: boolean;
};

const movies: Movie[] = [
  {
    id: 1,
    title: 'Мотоцикл в окне 2: Новогоднее чудо',
    description: 'Захватывающее продолжение истории о мотоцикле, который изменил жизнь целого города в канун Нового года.',
    price: 500,
    duration: '2ч 15мин',
    exclusiveProducts: [
      {
        id: 1,
        name: '3D очки',
        price: 150,
        description: 'Профессиональные 3D очки для максимального погружения'
      },
      {
        id: 2,
        name: 'Попкорн большой',
        price: 200,
        description: 'Свежий попкорн с выбором вкуса'
      },
      {
        id: 3,
        name: 'Напиток 0.5л',
        price: 100,
        description: 'Холодный напиток на выбор'
      },
      {
        id: 4,
        name: 'Набор конфет',
        price: 180,
        description: 'Ассорти премиальных конфет'
      }
    ]
  },
  {
    id: 2,
    title: 'Мотоцикл в окне: История Уилсона',
    description: 'Приквел, раскрывающий тайны прошлого главного героя и его легендарного мотоцикла.',
    price: 500,
    duration: '1ч 58мин',
    exclusiveProducts: [
      {
        id: 5,
        name: 'Эксклюзивные наушники',
        price: 300,
        description: 'Наушники с усиленным звуком, подключённые к кинозалу'
      },
      {
        id: 6,
        name: 'Комбо "Уилсон"',
        price: 350,
        description: 'Попкорн + напиток + хот-дог'
      },
      {
        id: 7,
        name: 'Постер фильма',
        price: 250,
        description: 'Лимитированный постер с автографом режиссёра'
      }
    ]
  },
  {
    id: 3,
    title: 'Мотоцикл: На весёлых поездах',
    description: 'Завершающая часть трилогии с невероятными погонями и неожиданными поворотами сюжета.',
    price: 500,
    duration: '2ч 30мин',
    exclusiveProducts: [
      {
        id: 8,
        name: 'VIP наушники с шумоподавлением',
        price: 500,
        description: 'Премиум наушники для идеального звука'
      },
      {
        id: 9,
        name: 'Комбо "Гонщик"',
        price: 450,
        description: 'Большой попкорн + 2 напитка + начос + сладости'
      },
      {
        id: 10,
        name: 'Мерч-набор',
        price: 600,
        description: 'Футболка + кепка + стикеры фильма'
      }
    ]
  }
];

export function Movies({ onMovieSelect, quizCompleted }: MoviesProps) {
  if (!quizCompleted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold mb-4 text-glow">Доступ ограничен</h2>
          <p className="text-muted-foreground mb-6">
            Для просмотра фильмов необходимо пройти тест на знание правил безопасности вождения мотоцикла.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 text-glow">Трилогия "Мотоцикл в окне"</h1>
        <p className="text-xl text-muted-foreground">
          Выберите фильм и забронируйте билеты с эксклюзивными товарами
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {movies.map((movie) => (
          <Card key={movie.id} className="p-6 hover:scale-105 transition-transform flex flex-col">
            <div className="flex-1">
              <div className="text-5xl mb-4 text-center">🎬</div>
              <Badge className="mb-2">{movie.duration}</Badge>
              <h3 className="text-xl font-bold mb-3 text-glow-sm">{movie.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{movie.description}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-sm">Эксклюзивные товары:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {movie.exclusiveProducts.slice(0, 3).map((product) => (
                    <li key={product.id}>• {product.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-primary">{movie.price} ₽</span>
                <span className="text-sm text-muted-foreground">за билет</span>
              </div>
              <Button 
                className="w-full hover:scale-105 transition-transform" 
                onClick={() => onMovieSelect(movie)}
              >
                Купить билет
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
