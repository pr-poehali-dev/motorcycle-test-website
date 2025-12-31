import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import type { Movie } from '../App';

const ORDERS_URL = 'https://functions.poehali.dev/14c391f3-2004-4d80-93dd-b22e99377b74';

type BookingProps = {
  movie: Movie | null;
  onBack: () => void;
  user: any;
};

type Seat = {
  row: number;
  number: number;
  occupied: boolean;
};

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const occupiedSeats = [
    { row: 1, number: 5 },
    { row: 2, number: 3 },
    { row: 2, number: 4 },
    { row: 3, number: 7 },
    { row: 4, number: 2 },
    { row: 5, number: 6 },
    { row: 5, number: 8 }
  ];

  for (let row = 1; row <= 6; row++) {
    for (let number = 1; number <= 10; number++) {
      seats.push({
        row,
        number,
        occupied: occupiedSeats.some((s) => s.row === row && s.number === number)
      });
    }
  }
  return seats;
};

export function Booking({ movie, onBack, user }: BookingProps) {
  const [seats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <p>Фильм не выбран</p>
          <Button onClick={onBack} className="mt-4">
            Назад к выбору фильмов
          </Button>
        </Card>
      </div>
    );
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.occupied) return;

    const isSelected = selectedSeats.some((s) => s.row === seat.row && s.number === seat.number);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => !(s.row === seat.row && s.number === seat.number)));
    } else {
      if (selectedSeats.length >= 10) {
        alert('Максимум 10 билетов за один заказ');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const toggleProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const calculateTotal = () => {
    const ticketsTotal = selectedSeats.length * movie.price;
    const productsTotal = selectedProducts.reduce((sum, productId) => {
      const product = movie.exclusiveProducts.find((p) => p.id === productId);
      return sum + (product?.price || 0);
    }, 0);
    return ticketsTotal + productsTotal;
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;

    const products = selectedProducts.map((productId) => {
      const product = movie!.exclusiveProducts.find((p) => p.id === productId);
      return product;
    }).filter(Boolean);

    try {
      const response = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          movieId: movie!.id,
          movieTitle: movie!.title,
          seats: selectedSeats,
          products,
          ticketPrice: movie!.price
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderDetails(data);
        setShowSuccessDialog(true);
        setSelectedSeats([]);
        setSelectedProducts([]);
      } else {
        alert('Ошибка оформления заказа');
      }
    } catch (error) {
      alert('Ошибка подключения к серверу');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <Icon name="ChevronLeft" className="mr-2" />
        Назад к фильмам
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-glow-sm">Выбор мест</h2>

            <div className="mb-8 bg-muted rounded-lg p-4 text-center">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-sm font-semibold">ЭКРАН</p>
            </div>

            <div className="mb-6">
              {[...Array(6)].map((_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2 mb-2">
                  <span className="w-8 text-center text-sm text-muted-foreground">{rowIndex + 1}</span>
                  {seats
                    .filter((seat) => seat.row === rowIndex + 1)
                    .map((seat) => {
                      const isSelected = selectedSeats.some(
                        (s) => s.row === seat.row && s.number === seat.number
                      );
                      return (
                        <button
                          key={`${seat.row}-${seat.number}`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.occupied}
                          className={`w-10 h-10 rounded-md text-xs font-semibold transition-all ${
                            seat.occupied
                              ? 'bg-destructive cursor-not-allowed'
                              : isSelected
                              ? 'bg-primary text-primary-foreground scale-110'
                              : 'bg-secondary hover:bg-accent hover:scale-105'
                          }`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>

            <div className="flex gap-6 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded-md"></div>
                <span>Свободно</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-md"></div>
                <span>Выбрано</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-destructive rounded-md"></div>
                <span>Занято</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="text-xl font-bold mb-4 text-glow-sm">Эксклюзивные товары</h3>
            <div className="space-y-4">
              {movie.exclusiveProducts.map((product) => (
                <div key={product.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleProduct(product.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={`product-${product.id}`} className="cursor-pointer">
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.description}</div>
                    </Label>
                  </div>
                  <Badge variant="secondary">{product.price} ₽</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-glow-sm">Ваш заказ</h3>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">{movie.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{movie.duration}</p>
            </div>

            {selectedSeats.length > 0 && (
              <div className="mb-4 pb-4 border-b border-border">
                <h4 className="font-semibold mb-2">Билеты ({selectedSeats.length})</h4>
                <div className="text-sm space-y-1">
                  {selectedSeats.map((seat) => (
                    <div key={`selected-${seat.row}-${seat.number}`} className="flex justify-between">
                      <span className="text-muted-foreground">
                        Ряд {seat.row}, место {seat.number}
                      </span>
                      <span>{movie.price} ₽</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProducts.length > 0 && (
              <div className="mb-4 pb-4 border-b border-border">
                <h4 className="font-semibold mb-2">Товары</h4>
                <div className="text-sm space-y-1">
                  {selectedProducts.map((productId) => {
                    const product = movie.exclusiveProducts.find((p) => p.id === productId);
                    if (!product) return null;
                    return (
                      <div key={product.id} className="flex justify-between">
                        <span className="text-muted-foreground">{product.name}</span>
                        <span>{product.price} ₽</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Итого:</span>
                <span className="text-primary">{calculateTotal()} ₽</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full hover:scale-105 transition-transform"
              disabled={selectedSeats.length === 0}
              onClick={handleBooking}
            >
              <Icon name="ShoppingCart" className="mr-2" />
              Оформить заказ
            </Button>

            {selectedSeats.length === 0 && (
              <p className="text-sm text-center text-muted-foreground mt-3">
                Выберите минимум одно место
              </p>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center mb-4">
              <div className="text-6xl mb-4">🎉</div>
              Билеты успешно куплены!
            </DialogTitle>
            <DialogDescription className="text-center space-y-6">
              <div className="bg-accent p-6 rounded-lg">
                <h3 className="text-xl font-bold text-foreground mb-3">Информация о сеансе</h3>
                <div className="space-y-2 text-foreground">
                  <p className="text-lg">
                    <strong>Фильм:</strong> {movie?.title}
                  </p>
                  {orderDetails && (
                    <p className="text-lg">
                      <strong>Дата выхода фильма:</strong>{' '}
                      <span className="text-primary font-bold">1 ноября 2026 года</span>
                    </p>
                  )}
                  <p className="text-lg">
                    <strong>Количество билетов:</strong> {selectedSeats.length || orderDetails?.ticketTotal / movie?.price}
                  </p>
                </div>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
                <p className="text-lg font-semibold text-foreground">
                  ⏰ Сеанс скоро начнётся!
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Не забудьте прийти за 15 минут до начала
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  setShowSuccessDialog(false);
                  onBack();
                }}
                className="w-full"
              >
                Отлично!
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}