import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita hidratação mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-9 h-9">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9 transition-all duration-300 hover:scale-105"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4 transition-all" />
          <span className="sr-only">Alternar para tema escuro</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 transition-all" />
          <span className="sr-only">Alternar para tema claro</span>
        </>
      )}
    </Button>
  );
}