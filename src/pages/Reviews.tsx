import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

type ReviewsProps = {
  quizCompleted: boolean;
};

type Review = {
  id: number;
  author: string;
  difficulty: 'easy' | 'hard';
  text: string;
  date: string;
};

const initialReviews: Review[] = [
  {
    id: 1,
    author: 'Михаил К.',
    difficulty: 'easy',
    text: 'Отличный тест! Вопросы понятные, не слишком сложные. Прошёл с первого раза.',
    date: '28.12.2024'
  },
  {
    id: 2,
    author: 'Анна С.',
    difficulty: 'hard',
    text: 'Некоторые вопросы оказались очень сложными, особенно про ABS и мёртвые зоны. Но в целом интересно!',
    date: '27.12.2024'
  },
  {
    id: 3,
    author: 'Дмитрий В.',
    difficulty: 'easy',
    text: 'Быстро прошёл, фильмы классные! Спасибо за возможность посмотреть трилогию.',
    date: '26.12.2024'
  }
];

export function Reviews({ quizCompleted }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = () => {
    if (!authorName.trim() || !reviewText.trim()) {
      alert('Заполните все поля');
      return;
    }

    if (!quizCompleted) {
      alert('Оставлять отзывы могут только те, кто прошёл тест');
      return;
    }

    const newReview: Review = {
      id: reviews.length + 1,
      author: authorName,
      difficulty,
      text: reviewText,
      date: new Date().toLocaleDateString('ru-RU')
    };

    setReviews([newReview, ...reviews]);
    setAuthorName('');
    setReviewText('');
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 text-glow">Отзывы</h1>
          <p className="text-xl text-muted-foreground">
            Поделитесь впечатлениями о тесте и фильмах
          </p>
        </div>

        <Card className="p-6 mb-8">
          {!showForm ? (
            <Button
              size="lg"
              onClick={() => {
                if (!quizCompleted) {
                  alert('Оставлять отзывы могут только те, кто прошёл тест');
                  return;
                }
                setShowForm(true);
              }}
              className="w-full hover:scale-105 transition-transform"
            >
              <Icon name="Plus" className="mr-2" />
              Оставить отзыв
            </Button>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-glow-sm">Ваш отзыв</h3>

              <div>
                <Label htmlFor="author">Ваше имя</Label>
                <Input
                  id="author"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Введите ваше имя"
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="mb-3 block">Сложность теста</Label>
                <RadioGroup value={difficulty} onValueChange={(value) => setDifficulty(value as 'easy' | 'hard')}>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="easy" id="easy" />
                      <Label htmlFor="easy" className="cursor-pointer">
                        😊 Было легко
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hard" id="hard" />
                      <Label htmlFor="hard" className="cursor-pointer">
                        🤔 Было сложно
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="review">Ваш отзыв</Label>
                <Textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Поделитесь своими впечатлениями..."
                  className="mt-2 min-h-32"
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSubmit} className="flex-1">
                  <Icon name="Send" className="mr-2" />
                  Отправить
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-glow-sm">Отзывы пользователей ({reviews.length})</h3>
          {reviews.map((review) => (
            <Card key={review.id} className="p-6 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg">{review.author}</h4>
                  <p className="text-sm text-muted-foreground">{review.date}</p>
                </div>
                <div className="text-2xl">
                  {review.difficulty === 'easy' ? '😊' : '🤔'}
                </div>
              </div>
              <p className="text-muted-foreground">{review.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
