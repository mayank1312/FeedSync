import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left section: Logo and Text */}
          <div className="flex items-center space-x-3">
            <div className="w-[42px] h-[42px] flex items-center justify-center rounded-full border-2 border-blue-500 bg-white dark:bg-slate-800 shadow-sm">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-[24px] h-[24px] object-contain transform scale-[1.8]"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                User Feedback System
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Collect and manage user feedback efficiently
              </p>
            </div>
          </div>

          {/* Right section: Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-blue-100 dark:hover:bg-slate-700 transition-all duration-200"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-slate-700" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-400" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
