import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useFinancialVisibility } from "@/components/PrivacyToggle";
import type { Sale, Expense, Bill } from "@/types";

interface TotalRevenueProps {
  sales: Sale[];
  expenses: Expense[];
  bills: Bill[];
}

export function TotalRevenue({ sales, expenses, bills }: TotalRevenueProps) {
  const { formatValue } = useFinancialVisibility();
  // Calcular lucro líquido total das vendas
  const totalNetProfit = sales.reduce((sum, sale) => sum + sale.netProfit, 0);
  
  // Calcular total de despesas
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calcular total de boletos (todos, independente do status)
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  
  // Calcular boletos pagos e pendentes separadamente
  const paidBills = bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);
  const pendingBills = bills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
  
  // Receita total real (lucro das vendas - despesas - boletos pagos)
  const totalRealRevenue = totalNetProfit - totalExpenses - paidBills;
  
  // Receita projetada (considerando boletos pendentes)
  const projectedRevenue = totalRealRevenue - pendingBills;
  
  // Calcular percentuais para o gráfico
  const totalDeductions = totalExpenses + paidBills;
  const deductionPercentage = totalNetProfit > 0 ? (totalDeductions / totalNetProfit) * 100 : 0;
  
  // Separar lucros por perfil
  const jfProfit = sales.filter(s => s.profile === 'JF').reduce((sum, sale) => sum + sale.netProfit, 0);
  const lucianaProfit = sales.filter(s => s.profile === 'Luciana').reduce((sum, sale) => sum + sale.netProfit, 0);

  return (
    <div className="space-y-6">
      {/* Card Principal - Receita Total */}
      <Card className="shadow-card bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-green-300/10 rounded-full translate-y-12 -translate-x-12"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-green-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            💰 Receita Total Real da Empresa
          </CardTitle>
          <CardDescription className="text-green-700 text-base">
            Lucro líquido das vendas menos todas as despesas e boletos pagos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Valor Principal */}
          <div className="text-center relative">
            <div className="mb-4">
              <div className={`text-5xl md:text-6xl font-black mb-3 animate-pulse ${totalRealRevenue >= 0 ? "text-green-600" : "text-red-600"}`}>
                 <span className="drop-shadow-lg">
                   {totalRealRevenue >= 0 ? "💰 +" : "⚠️ "}{formatValue(Math.abs(totalRealRevenue))}
                 </span>
               </div>
              <div className="flex justify-center">
                <Badge 
                  variant={totalRealRevenue >= 0 ? "default" : "destructive"}
                  className="text-xl px-6 py-3 font-bold shadow-lg animate-bounce"
                >
                  {totalRealRevenue >= 0 ? (
                    <><CheckCircle className="h-5 w-5 mr-2" />🎉 Lucro Real!</>
                  ) : (
                    <><AlertTriangle className="h-5 w-5 mr-2" />📉 Prejuízo</>
                  )}
                </Badge>
              </div>
            </div>
            {totalRealRevenue >= 0 && (
              <div className="text-sm text-green-700 font-medium bg-green-100 rounded-full px-4 py-2 inline-block">
                🚀 Parabéns! Sua empresa está lucrando!
              </div>
            )}
          </div>

          {/* Breakdown dos Cálculos */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/30 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2">
                   <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                   <span className="text-2xl font-bold text-blue-600">+{formatValue(totalNetProfit)}</span>
                 </div>
                 <div className="text-sm font-medium text-blue-700 mb-1">💎 Lucro das Vendas</div>
                 <div className="text-xs text-blue-600">
                   JF: {formatValue(jfProfit)} | Luciana: {formatValue(lucianaProfit)}
                 </div>
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/30 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2">
                   <TrendingDown className="h-6 w-6 text-orange-600 mr-2" />
                   <span className="text-2xl font-bold text-orange-600">-{formatValue(totalExpenses)}</span>
                 </div>
                <div className="text-sm font-medium text-orange-700 mb-1">📊 Despesas</div>
                <div className="text-xs text-orange-600">
                  {expenses.length} despesa(s) registrada(s)
                </div>
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-200/30 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2">
                   <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                   <span className="text-2xl font-bold text-red-600">-{formatValue(paidBills)}</span>
                 </div>
                <div className="text-sm font-medium text-red-700 mb-1">💳 Boletos Pagos</div>
                <div className="text-xs text-red-600">
                  {bills.filter(b => b.status === 'paid').length} boleto(s) pago(s)
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Eficiência Financeira</span>
              <span>{Math.max(0, 100 - deductionPercentage).toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.max(0, 100 - deductionPercentage)} 
              className="h-3"
            />
            <div className="text-xs text-muted-foreground">
              Percentual do lucro retido após deduções
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Secundários */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Projeção com Boletos Pendentes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-yellow-600" />
              Projeção com Pendências
            </CardTitle>
            <CardDescription>
              Receita considerando boletos pendentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-3">
              <div className="text-2xl font-bold text-yellow-600">
                R$ {projectedRevenue.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Após pagar R$ {pendingBills.toFixed(2)} em boletos pendentes
              </div>
              <Badge variant="outline" className="text-yellow-700">
                {bills.filter(b => b.status === 'pending').length} boleto(s) pendente(s)
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Resumo Financeiro
            </CardTitle>
            <CardDescription>
              Visão geral das movimentações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total de Vendas:</span>
              <span className="font-medium">R$ {sales.reduce((sum, sale) => sum + (sale.salePrice * sale.quantity), 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Impostos Pagos:</span>
              <span className="font-medium text-orange-600">R$ {sales.reduce((sum, sale) => sum + sale.standardTax + sale.profileTax, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Custos de Produtos:</span>
              <span className="font-medium text-red-600">R$ {sales.reduce((sum, sale) => sum + (sale.purchasePrice * sale.quantity), 0).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Lucro Operacional:</span>
                <span className="text-green-600">R$ {totalNetProfit.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}