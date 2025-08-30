import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FinancialVisibilityProvider } from "@/components/PrivacyToggle";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateAdmin from "./pages/CreateAdmin";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log("App is rendering");
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FinancialVisibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Pricing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/create-admin" element={<CreateAdmin />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FinancialVisibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
