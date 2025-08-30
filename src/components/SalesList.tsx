import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Edit, Calendar, User, Package } from "lucide-react";
import { EditSaleDialog } from "@/components/EditSaleDialog";
import { useFinancialVisibility } from "@/components/PrivacyToggle";
import type { Sale } from "@/types";

interface SalesListProps {
  sales: Sale[];
  onEditSale: (saleId: string, updates: { 
    profile: 'JF' | 'Luciana';
    quantity: number;
    salePrice: number;
  }) => Promise<void>;
  calculateSale: (
    salePrice: number,
    purchasePrice: number,
    quantity: number,
    profile: 'JF' | 'Luciana',
    marketplace?: 'Shopee' | 'Mercado Livre'
  ) => {
    standardTax: number;
    profileTax: number;
    netProfit: number;
  };
}

export function SalesList({ sales, onEditSale, calculateSale }: SalesListProps) {
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const { formatValue } = useFinancialVisibility();

  if (sales.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma venda registrada ainda</p>
      </div>
    );
  }

  // Ordenar vendas por data (mais recentes primeiro)
  const sortedSales = [...sales].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {sortedSales.map((sale) => (
          <Card key={sale.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium">{sale.productName}</h4>
                    <Badge 
                      variant={sale.profile === 'JF' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      <User className="h-3 w-3 mr-1" />
                      {sale.profile}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className="text-xs"
                    >
                      {sale.marketplace === 'Mercado Livre' ? '🛒' : '📦'} {sale.marketplace}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quantidade:</span>
                        <span className="font-medium">{sale.quantity}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preço Unit.:</span>
                        <span className="font-medium">{formatValue(sale.salePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Venda:</span>
                        <span className="font-medium">{formatValue(sale.salePrice * sale.quantity)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa Padrão:</span>
                        <span className="text-orange-600">{formatValue(sale.standardTax, '-R$ ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxa Perfil:</span>
                        <span className="text-orange-600">{formatValue(sale.profileTax, '-R$ ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lucro Líquido:</span>
                        <Badge variant={sale.netProfit > 0 ? 'default' : 'destructive'}>
                          {formatValue(sale.netProfit)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(sale.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSale(sale)}
                    className="h-8 w-8 p-0"
                    title="Editar venda"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {editingSale && (
        <EditSaleDialog
          sale={editingSale}
          open={!!editingSale}
          onOpenChange={(open) => !open && setEditingSale(null)}
          onSave={onEditSale}
          calculateSale={calculateSale}
        />
      )}
    </>
  );
}