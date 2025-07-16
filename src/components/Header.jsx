import { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { dark, toggle } = useContext(ThemeContext);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 mb-6 transition-colors text-gray-800 dark:text-gray-100">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary dark:text-white">📊 Lead Agent Dashboard</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="text-gray-600 dark:text-white hover:text-primary transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-100 select-none">
            {dark ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
      </div>
    </header>
  );
}