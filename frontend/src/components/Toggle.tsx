import { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { DarkmodeContext } from '../context/DarkmodeContext';

export const ThemeToggle = () => {
  const context = useContext(DarkmodeContext);
  if (!context) throw new Error("DarkmodeContext must be used inside the provider.");
  
  const { theme, setTheme } = context;

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  };

  return (
    <button
      onClick={toggleTheme}
      className={`cursor-pointer relative inline-flex items-center h-10 w-20 rounded-full transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-600 focus:ring-offset-gray-900' 
          : 'bg-gray-300 focus:ring-offset-gray-50'
      }`}
      aria-label="Toggle dark mode"
    >
      <div
        className={`inline-block h-8 w-8 rounded-full bg-white shadow-lg transform transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-11' : 'translate-x-1'
        }`}
      >
        <div className="flex items-center justify-center h-full">
          {theme === 'dark' ? (
            <Moon className="h-5 w-5 text-gray-700" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-500" />
          )}
        </div>
      </div>
    </button>
  );
};
