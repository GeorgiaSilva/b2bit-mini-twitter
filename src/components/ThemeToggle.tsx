import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/useTheme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button

      onClick={toggleTheme}
      className="fixed right-4 top-4 text-slate-800 dark:text-slate-100 px-4 py-2 rounded"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}