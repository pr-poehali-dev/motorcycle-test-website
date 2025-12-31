import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Home } from './pages/Home';
import { Quiz } from './pages/Quiz';
import { Movies } from './pages/Movies';
import { Booking } from './pages/Booking';
import { Reviews } from './pages/Reviews';
import { Products } from './pages/Products';
import { Snowflakes } from './components/Snowflakes';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';

const queryClient = new QueryClient();

type Theme = 'default' | 'dark' | 'light' | 'newyear' | 'purple';
type Page = 'home' | 'quiz' | 'movies' | 'booking' | 'reviews' | 'products' | 'auth' | 'profile';

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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('default', 'dark', 'light', 'newyear', 'purple');
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

  const handleLogin = (userData: any) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (!user && currentPage === 'booking') {
      return <Auth onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'quiz':
        return <Quiz onComplete={handleQuizComplete} />;
      case 'movies':
        return <Movies onMovieSelect={handleMovieSelect} quizCompleted={quizCompleted} />;
      case 'booking':
        return <Booking movie={selectedMovie} onBack={() => setCurrentPage('movies')} user={user} />;
      case 'reviews':
        return <Reviews quizCompleted={quizCompleted} />;
      case 'products':
        return <Products />;
      case 'auth':
        return <Auth onLogin={handleLogin} />;
      case 'profile':
        return <Profile user={user} onUpdate={setUser} onLogout={handleLogout} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {theme === 'newyear' && <Snowflakes />}
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

              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentPage('profile')}
                  className="ml-4"
                >
                  <Icon name="User" className="mr-2" />
                  {user.display_name || user.displayName}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentPage('auth')}
                  className="ml-4"
                >
                  <Icon name="LogIn" className="mr-2" />
                  Войти
                </Button>
              )}

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
                <button
                  onClick={() => setTheme('newyear')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    theme === 'newyear' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  title="Новогодняя тема"
                >
                  ❄️
                </button>
                <button
                  onClick={() => setTheme('purple')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    theme === 'purple' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  }`}
                  title="Фиолетовая тема"
                >
                  💜
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 relative z-10">
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