import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  AlertTriangle,
  ShoppingBag,
  Calculator,
  Users
} from "lucide-react";
import { useFinancialVisibility } from "@/components/PrivacyToggle";
import type { Product, Sale } from "@/types";

interface DashboardProps {
  totalSales: number;
  totalProfit: number;
  totalTaxes: number;
  totalProducts: number;
  lowStockProducts: number;
  sales: Sale[];
  products: Product[];
}

export function Dashboard({
  totalSales,
  totalProfit,
  totalTaxes,
  totalProducts,
  lowStockProducts,
  sales,
  products
}: DashboardProps) {
  const { formatValue } = useFinancialVisibility();
  // Vendas por perfil
  const jfSales = sales.filter(s => s.profile === 'JF');
  const lucianaSales = sales.filter(s => s.profile === 'Luciana');
  
  const jfTotal = jfSales.reduce((sum, sale) => sum + (sale.salePrice * sale.quantity), 0);
  const lucianaTotal = lucianaSales.reduce((sum, sale) => sum + (sale.salePrice * sale.quantity), 0);
  
  const jfProfit = jfSales.reduce((sum, sale) => sum + sale.netProfit, 0);
  const lucianaProfit = lucianaSales.reduce((sum, sale) => sum + sale.netProfit, 0);

  // Produtos mais vendidos
  const productSales = sales.reduce((acc, sale) => {
    acc[sale.productId] = (acc[sale.productId] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productSales)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return { product, quantity: quantity as number };
    })
    .filter(item => item.product);

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatValue(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              {sales.length} vendas realizadas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatValue(totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              Após todas as taxas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Taxas</CardTitle>
            <Calculator className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatValue(totalTaxes)}</div>
            <p className="text-xs text-muted-foreground">
              Impostos e taxas deduzidas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <div className="flex items-center space-x-2 text-xs">
              {lowStockProducts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {lowStockProducts} com estoque baixo
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendas por Perfil */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Vendas por Perfil
            </CardTitle>
            <CardDescription>Comparativo de performance entre perfis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">JF Acessórios</span>
                <span className="text-sm text-muted-foreground">{formatValue(jfTotal)}</span>
              </div>
              <Progress 
                value={totalSales > 0 ? (jfTotal / totalSales) * 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{jfSales.length} vendas</span>
                <span>Lucro: {formatValue(jfProfit)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Luciana Acessórios</span>
                <span className="text-sm text-muted-foreground">{formatValue(lucianaTotal)}</span>
              </div>
              <Progress 
                value={totalSales > 0 ? (lucianaTotal / totalSales) * 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{lucianaSales.length} vendas</span>
                <span>Lucro: {formatValue(lucianaProfit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>Top 5 produtos por quantidade vendida</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((item, index) => (
                  <div key={item.product!.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <span className="text-sm font-medium">{item.product!.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.quantity} vendidos</div>
                      <div className="text-xs text-muted-foreground">
                        Estoque: {item.product!.stock}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma venda registrada ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Estoque */}
      {lowStockProducts > 0 && (
        <Card className="shadow-card border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Atenção: Estoque Baixo
            </CardTitle>
            <CardDescription>
              {lowStockProducts} produto(s) com estoque abaixo de 5 unidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {products.filter(p => p.stock < 5).map(product => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Preço: R$ {product.purchasePrice.toFixed(2)}
                    </div>
                  </div>
                  <Badge variant={product.stock === 0 ? "destructive" : "warning"}>
                    {product.stock} em estoque
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}