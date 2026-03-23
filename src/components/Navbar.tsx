import { LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

type NavbarProps = {
  onLogout?: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  isAuthenticated: boolean;
};

export const Navbar = ({
  onLogout,
  search,
  onSearchChange,
  isAuthenticated,
}: NavbarProps) => {
  return (
    <main className="fixed top-0 left-0 w-full flex flex-wrap items-center justify-between gap-3 border-b border-gary-300 dark:border-gray-700 p-3 bg-(--bg) z-10">
      <h6 className="text-lg font-semibold text-(--blue) dark:text-white">Mini Twitter</h6>
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por titulo ou conteudo..."
        className=" rounded-lg border w-100 border-gray-400 bg-(--card-bg) p-2 outline-none"
      />
      <div className="flex items-center gap-2 ">
        <ThemeToggle />
        {isAuthenticated ? (
          <button
            type="button"
            className="flex items-center p-2 bg-(--card-bg) rounded-full"
            onClick={onLogout}
            aria-label="Logout"
          >
            <LogOutIcon size={16} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/auth/register"
              className="rounded-full border border-gray-600 px-3 py-1.5 text-sm hover:bg-white/10 transition-colors"
            >
              Registre-se
            </Link>
            <Link
              to="/auth/login"
              className="rounded-full bg-(--blue) px-3 py-1.5 text-sm text-white hover:opacity-90 transition-opacity"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};
