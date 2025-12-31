import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Movies } from './pages/Movies';
import { Booking } from './pages/Booking';
import { Reviews } from './pages/Reviews';
import { Products } from './pages/Products';

const queryClient = new QueryClient();

type Theme = 'default' | 'dark' | 'light';
type Page = 'home' | 'quiz' | 'movies' | 'booking' | 'reviews' | 'products';

export type Movie = {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  exclusiveProducts: {
    id: number;
    name: string;
    price: number;
    description: string;
  }[];
};

function AppContent() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    document.documentElement.classList.remove('default', 'dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setCurrentPage('movies');
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentPage('booking');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'quiz':
        return <Quiz onComplete={handleQuizComplete} />;
      case 'movies':
        return <Movies onMovieSelect={handleMovieSelect} quizCompleted={quizCompleted} />;
      case 'booking':
        return <Booking movie={selectedMovie} onBack={() => setCurrentPage('movies')} />;
      case 'reviews':
        return <Reviews quizCompleted={quizCompleted} />;
      case 'products':
        return <Products />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border backdrop-blur-lg bg-opacity-90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 
              className="text-2xl font-bold text-glow cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setCurrentPage('home')}
            >
              🏍️ МОЙ ТЕСТ
            </h1>
            
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentPage('home')}
                className={`hover:text-primary transition-colors ${currentPage === 'home' ? 'text-primary' : ''}`}
              >
                Главная
              </button>
              <button
                onClick={() => setCurrentPage('quiz')}
                className={`hover:text-primary transition-colors ${currentPage === 'quiz' ? 'text-primary' : ''}`}
              >
                Тест
              </button>
              <button
                onClick={() => setCurrentPage('movies')}
                className={`hover:text-primary transition-colors ${currentPage === 'movies' ? 'text-primary' : ''}`}
                disabled={!quizCompleted}
              >
                Фильмы
              </button>
              <button
                onClick={() => setCurrentPage('products')}
                className={`hover:text-primary transition-colors ${currentPage === 'products' ? 'text-primary' : ''}`}
              >
                Товары
              </button>
              <button
                onClick={() => setCurrentPage('reviews')}
                className={`hover:text-primary transition-colors ${currentPage === 'reviews' ? 'text-primary' : ''}`}
              >
                Отзывы
              </button>

              <div className="flex gap-2 ml-4 border-l border-border pl-4">
                <button
                  onClick={() => setTheme('default')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    theme === 'default' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  title="Обычная тема"
                >
                  🌿
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  title="Тёмная тема"
                >
                  🌙
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  title="Светлая тема"
                >
                  ☀️
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {renderPage()}
      </main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
