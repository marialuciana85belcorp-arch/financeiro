import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Pricing = () => {
  console.log("Pricing component is rendering");
  const plans = [
    {
      name: "Mensal",
      price: "R$ 49,90",
      period: "/mês",
      description: "Ideal para começar",
      badge: null,
      features: [
        "Sistema completo de vendas",
        "Controle de estoque",
        "Relatórios básicos",
        "Gestão de despesas",
        "Suporte por email",
        "Backup automático"
      ]
    },
    {
      name: "Trimestral",
      price: "R$ 39,90",
      period: "/mês",
      originalPrice: "R$ 149,70",
      totalPrice: "R$ 119,70",
      description: "Melhor custo-benefício",
      badge: "Mais Popular",
      features: [
        "Tudo do plano mensal",
        "Relatórios avançados",
        "Análise de lucros por perfil",
        "Histórico completo",
        "Suporte prioritário",
        "Backup em tempo real",
        "Exportação de dados",
        "Dashboard personalizado"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="container mx-auto px-4 py-16">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            💰 Lucro Fácil
          </h1>
          <p className="text-xl text-foreground/80 mb-4">
            Sistema completo para controle financeiro e maximização de lucros
          </p>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Gerencie vendas, despesas e receitas com cálculo automático de lucros e relatórios detalhados
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative transition-all duration-300 hover:shadow-primary ${
                plan.badge ? 'ring-2 ring-primary/20 scale-105' : ''
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                  {plan.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  
                  {plan.totalPrice && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground line-through">{plan.originalPrice}</span>
                      <span className="ml-2 text-success font-semibold">{plan.totalPrice} total</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild
                  className={`w-full ${
                    plan.badge 
                      ? 'bg-gradient-primary hover:opacity-90' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  size="lg"
                >
                  <Link to="/auth">
                    Começar Agora
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Por que escolher o Acessórios Flow?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dois Perfis de Negócio</h3>
              <p className="text-muted-foreground">Configure diferentes taxas e margens para JF e Luciana</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Relatórios Detalhados</h3>
              <p className="text-muted-foreground">Acompanhe lucros, despesas e performance em tempo real</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Controle Automático</h3>
              <p className="text-muted-foreground">Cálculo automático de impostos e atualização de estoque</p>
            </div>
          </div>
        </div>
        
        {/* Admin Test Button - Development Only */}
        <div className="text-center mt-16 pt-8 border-t border-muted">
          <p className="text-sm text-muted-foreground mb-4">Ambiente de desenvolvimento</p>
          <Link to="/create-admin">
            <Button variant="outline" size="sm">
              🔧 Criar Admin de Teste
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;