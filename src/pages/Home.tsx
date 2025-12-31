import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type HomeProps = {
  onNavigate: (page: 'home' | 'quiz' | 'movies' | 'booking' | 'reviews' | 'products') => void;
};

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-6xl font-bold mb-6 text-glow">
          🏍️ Мотоцикл в окне
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Пройди тест на настоящего мотоциклиста и получи доступ к эксклюзивным фильмам!
        </p>
        <Button 
          size="lg" 
          onClick={() => onNavigate('quiz')}
          className="text-lg px-8 py-6 hover:scale-105 transition-transform"
        >
          <Icon name="Play" className="mr-2" />
          Начать тест
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('quiz')}>
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2 text-glow-sm">Пройди тест</h3>
          <p className="text-muted-foreground">
            Ответь на вопросы о безопасности и правилах вождения мотоцикла
          </p>
        </Card>

        <Card className="p-6 hover:scale-105 transition-transform">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="text-xl font-bold mb-2 text-glow-sm">Смотри фильмы</h3>
          <p className="text-muted-foreground">
            Получи доступ к трилогии "Мотоцикл в окне" после успешного прохождения теста
          </p>
        </Card>

        <Card className="p-6 hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate('reviews')}>
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-bold mb-2 text-glow-sm">Оставь отзыв</h3>
          <p className="text-muted-foreground">
            Поделись своим мнением о тесте и фильмах с другими пользователями
          </p>
        </Card>
      </div>

      <div className="bg-card rounded-lg p-8 border border-border">
        <h2 className="text-3xl font-bold mb-6 text-center text-glow-sm">
          Доступные фильмы
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-5xl mb-3">🎥</div>
            <h4 className="font-bold text-lg mb-2">Мотоцикл в окне 2</h4>
            <p className="text-sm text-muted-foreground">Новогоднее чудо</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">🎥</div>
            <h4 className="font-bold text-lg mb-2">Мотоцикл в окне</h4>
            <p className="text-sm text-muted-foreground">История Уилсона</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-3">🎥</div>
            <h4 className="font-bold text-lg mb-2">Мотоцикл</h4>
            <p className="text-sm text-muted-foreground">На весёлых поездах</p>
          </div>
        </div>
      </div>
    </div>
  );
}
