import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type QuizProps = {
  onComplete: () => void;
};

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

const questions: Question[] = [
  {
    id: 1,
    question: 'Обязательно ли носить шлем при езде на мотоцикле?',
    options: ['Да, всегда', 'Только на трассе', 'Нет, это по желанию', 'Только в городе'],
    correctAnswer: 0,
    difficulty: 'easy'
  },
  {
    id: 2,
    question: 'Какая минимальная категория прав нужна для управления мотоциклом?',
    options: ['Категория B', 'Категория A', 'Категория C', 'Категория D'],
    correctAnswer: 1,
    difficulty: 'medium'
  },
  {
    id: 3,
    question: 'Что означает ABS на мотоцикле?',
    options: [
      'Автоматическая тормозная система',
      'Антиблокировочная система тормозов',
      'Аэродинамический баланс системы',
      'Активная батарея стабилизации'
    ],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 4,
    question: 'При какой температуре асфальта максимально опасно торможение на мотоцикле?',
    options: ['При +30°C', 'При 0°C и ниже', 'При +15°C', 'При +40°C'],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 5,
    question: 'Какое защитное снаряжение обязательно помимо шлема?',
    options: [
      'Только перчатки',
      'Перчатки и куртка',
      'Полный комплект: перчатки, куртка, штаны, ботинки',
      'Ничего, кроме шлема'
    ],
    correctAnswer: 2,
    difficulty: 'medium'
  },
  {
    id: 6,
    question: 'Что такое "мёртвая зона" для мотоциклиста?',
    options: [
      'Зона, где не работает двигатель',
      'Область, не видимая в зеркалах',
      'Зона запрещённого движения',
      'Неосвещённый участок дороги'
    ],
    correctAnswer: 1,
    difficulty: 'hard'
  },
  {
    id: 7,
    question: 'Можно ли перевозить пассажира на мотоцикле без специального сидения?',
    options: ['Да', 'Нет', 'Только на короткие расстояния', 'Только родственников'],
    correctAnswer: 1,
    difficulty: 'easy'
  },
  {
    id: 8,
    question: 'Какой манёвр наиболее опасен для мотоциклиста в дождь?',
    options: ['Ускорение', 'Резкое торможение', 'Поворот', 'Все перечисленные'],
    correctAnswer: 3,
    difficulty: 'hard'
  }
];

export function Quiz({ onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Лёгкий';
      case 'medium':
        return 'Средний';
      case 'hard':
        return 'Сложный';
      default:
        return '';
    }
  };

  if (showResult) {
    const passed = score >= questions.length * 0.8;

    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <div className="text-6xl mb-6">{passed ? '🎉' : '😔'}</div>
          <h2 className="text-4xl font-bold mb-4 text-glow">
            {passed ? 'Поздравляем!' : 'Попробуйте ещё раз'}
          </h2>
          <p className="text-xl mb-6">
            Вы правильно ответили на {score} из {questions.length} вопросов
          </p>
          <Progress value={(score / questions.length) * 100} className="mb-6" />
          {passed ? (
            <>
              <p className="text-muted-foreground mb-6">
                Вы успешно прошли тест! Теперь вам доступны все фильмы трилогии "Мотоцикл в окне".
              </p>
              <Button size="lg" onClick={onComplete} className="hover:scale-105 transition-transform">
                Перейти к фильмам
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Для доступа к фильмам нужно правильно ответить минимум на 80% вопросов.
              </p>
              <Button
                size="lg"
                onClick={() => {
                  setCurrentQuestion(0);
                  setScore(0);
                  setShowResult(false);
                  setSelectedAnswer(null);
                }}
              >
                Пройти тест заново
              </Button>
            </>
          )}
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Вопрос {currentQuestion + 1} из {questions.length}
            </span>
            <span className={`text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
              {getDifficultyLabel(question.difficulty)}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-glow-sm">{question.question}</h2>

        <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <Button
          size="lg"
          onClick={handleAnswer}
          disabled={selectedAnswer === null}
          className="w-full mt-8 hover:scale-105 transition-transform"
        >
          {currentQuestion < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
        </Button>
      </Card>
    </div>
  );
}
