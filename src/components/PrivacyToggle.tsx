import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Contexto para gerenciar a visibilidade dos dados financeiros
const FinancialVisibilityContext = createContext<{
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}>({ isVisible: true, setIsVisible: () => {} });

// Provider para o contexto
export function FinancialVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem('financial-data-visible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('financial-data-visible', JSON.stringify(isVisible));
  }, [isVisible]);

  return (
    <FinancialVisibilityContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </FinancialVisibilityContext.Provider>
  );
}

interface PrivacyToggleProps {
  onToggle: (isVisible: boolean) => void;
}

export function PrivacyToggle({ onToggle }: PrivacyToggleProps) {
  const { isVisible, setIsVisible } = useContext(FinancialVisibilityContext);

  useEffect(() => {
    onToggle(isVisible);
  }, [isVisible, onToggle]);

  const handleToggle = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    
    toast.success(
      newVisibility 
        ? '💰 Dados financeiros visíveis' 
        : '🔒 Dados financeiros ocultos'
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
      title={isVisible ? 'Ocultar dados financeiros' : 'Mostrar dados financeiros'}
    >
      {isVisible ? (
        <>
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Ocultar Valores</span>
        </>
      ) : (
        <>
          <EyeOff className="h-4 w-4" />
          <span className="hidden sm:inline">Mostrar Valores</span>
        </>
      )}
    </Button>
  );
}

// Hook para usar a visibilidade dos dados
export function useFinancialVisibility() {
  const { isVisible, setIsVisible } = useContext(FinancialVisibilityContext);

  const formatValue = (value: number, prefix: string = 'R$ ') => {
    return isVisible ? `${prefix}${value.toFixed(2)}` : '••••••';
  };

  const formatNumber = (value: number) => {
    return isVisible ? value.toString() : '•••';
  };

  return {
    isVisible,
    setIsVisible,
    formatValue,
    formatNumber
  };
}