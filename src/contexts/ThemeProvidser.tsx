import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";

function getInitialTheme(): "light" | "dark" {
  const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }
  return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () =>
        setTheme((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}