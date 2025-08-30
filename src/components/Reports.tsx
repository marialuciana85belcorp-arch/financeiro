import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  Filter
} from "lucide-react";
import type { Sale } from "@/types";

interface ReportsProps {
  sales: Sale[];
}

export function Reports({ sales }: ReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedProfile, setSelectedProfile] = useState<'all' | 'JF' | 'Luciana'>('all');

  // Gerar lista de meses disponíveis
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    sales.forEach(sale => {
      const date = new Date(sale.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    
    // Adicionar mês atual se não houver vendas
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    months.add(currentMonth);
    
    return Array.from(months).sort().reverse();
  }, [sales]);

  // Filtrar vendas baseado nos filtros selecionados
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      const saleMonth = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      
      const matchesMonth = saleMonth === selectedMonth;
      const matchesProfile = selectedProfile === 'all' || sale.profile === selectedProfile;
      
      return matchesMonth && matchesProfile;
    });
  }, [sales, selectedMonth, selectedProfile]);

  // Calcular métricas
  const metrics = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.salePrice * sale.quantity), 0);
    const totalTaxes = filteredSales.reduce((sum, sale) => sum + sale.standardTax + sale.profileTax, 0);
    const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.netProfit, 0);
    const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    
    return {
      totalSales,
      totalTaxes,
      totalProfit,
      totalQuantity,
      salesCount: filteredSales.length
    };
  }, [filteredSales]);

  // Análise por produto
  const productAnalysis = useMemo(() => {
    const analysis = filteredSales.reduce((acc, sale) => {
      if (!acc[sale.productName]) {
        acc[sale.productName] = {
          quantity: 0,
          revenue: 0,
          profit: 0,
          sales: 0
        };
      }
      
      acc[sale.productName].quantity += sale.quantity;
      acc[sale.productName].revenue += sale.salePrice * sale.quantity;
      acc[sale.productName].profit += sale.netProfit;
      acc[sale.productName].sales += 1;
      
      return acc;
    }, {} as Record<string, { quantity: number; revenue: number; profit: number; sales: number }>);

    return Object.entries(analysis)
      .map(([name, data]) => ({ name, ...(data as any) }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredSales]);

  // Análise por perfil
  const profileAnalysis = useMemo(() => {
    const jfSales = filteredSales.filter(s => s.profile === 'JF');
    const lucianaSales = filteredSales.filter(s => s.profile === 'Luciana');
    
    return {
      JF: {
        sales: jfSales.length,
        revenue: jfSales.reduce((sum, sale) => sum + (sale.salePrice * sale.quantity), 0),
        profit: jfSales.reduce((sum, sale) => sum + sale.netProfit, 0),
        taxes: jfSales.reduce((sum, sale) => sum + sale.standardTax + sale.profileTax, 0)
      },
      Luciana: {
        sales: lucianaSales.length,
        revenue: lucianaSales.reduce((sum, sale) => sum + (sale.salePrice * sale.quantity), 0),
        profit: lucianaSales.reduce((sum, sale) => sum + sale.netProfit, 0),
        taxes: lucianaSales.reduce((sum, sale) => sum + sale.standardTax + sale.profileTax, 0)
      }
    };
  }, [filteredSales]);

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Selecione o período e perfil para análise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mês</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map(month => (
                    <SelectItem key={month} value={month}>
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Perfil</label>
              <Select value={selectedProfile} onValueChange={(value: any) => setSelectedProfile(value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Perfis</SelectItem>
                  <SelectItem value="JF">JF Acessórios</SelectItem>
                  <SelectItem value="Luciana">Luciana Acessórios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Período */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {metrics.totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.salesCount} vendas • {metrics.totalQuantity} itens
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">R$ {metrics.totalProfit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Margem: {metrics.totalSales > 0 ? ((metrics.totalProfit / metrics.totalSales) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Taxas</CardTitle>
            <BarChart3 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">R$ {metrics.totalTaxes.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalSales > 0 ? ((metrics.totalTaxes / metrics.totalSales) * 100).toFixed(1) : 0}% das vendas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <Calendar className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {metrics.salesCount > 0 ? (metrics.totalSales / metrics.salesCount).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Por venda realizada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Perfil */}
      {selectedProfile === 'all' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>JF Acessórios</CardTitle>
              <CardDescription>Performance do perfil JF</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vendas:</span>
                <span className="font-medium">R$ {profileAnalysis.JF.revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lucro:</span>
                <span className="font-medium text-success">R$ {profileAnalysis.JF.profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxas:</span>
                <span className="font-medium text-warning">R$ {profileAnalysis.JF.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nº Vendas:</span>
                <Badge variant="outline">{profileAnalysis.JF.sales}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Luciana Acessórios</CardTitle>
              <CardDescription>Performance do perfil Luciana</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vendas:</span>
                <span className="font-medium">R$ {profileAnalysis.Luciana.revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lucro:</span>
                <span className="font-medium text-success">R$ {profileAnalysis.Luciana.profit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Taxas:</span>
                <span className="font-medium text-warning">R$ {profileAnalysis.Luciana.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nº Vendas:</span>
                <Badge variant="outline">{profileAnalysis.Luciana.sales}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Análise por Produto */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Análise por Produto</CardTitle>
          <CardDescription>
            Performance dos produtos no período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {productAnalysis.length > 0 ? (
            <div className="space-y-4">
              {productAnalysis.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.sales} vendas • {product.quantity} unidades
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">R$ {product.revenue.toFixed(2)}</div>
                    <div className="text-sm text-success">
                      Lucro: R$ {product.profit.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma venda encontrada para o período selecionado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}