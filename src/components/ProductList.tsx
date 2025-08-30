import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, AlertTriangle, TrendingUp, Edit } from "lucide-react";
import { useState } from "react";
import { EditProductDialog } from "@/components/EditProductDialog";
import { useFinancialVisibility } from "@/components/PrivacyToggle";
import type { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  onEditProduct: (productId: string, updates: { name: string; purchasePrice: number; stock: number }) => Promise<void>;
}

export function ProductList({ products, onEditProduct }: ProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { formatValue } = useFinancialVisibility();
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum produto cadastrado ainda</p>
        <p className="text-sm text-muted-foreground mt-1">
          Cadastre seu primeiro produto usando o formulário ao lado
        </p>
      </div>
    );
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { variant: "destructive" as const, label: "Sem estoque", icon: AlertTriangle };
    if (stock < 5) return { variant: "warning" as const, label: "Estoque baixo", icon: AlertTriangle };
    if (stock < 10) return { variant: "secondary" as const, label: "Estoque ok", icon: Package };
    return { variant: "default" as const, label: "Bom estoque", icon: TrendingUp };
  };

  const sortedProducts = [...products].sort((a, b) => {
    // Produtos sem estoque primeiro, depois por nome
    if (a.stock === 0 && b.stock > 0) return -1;
    if (b.stock === 0 && a.stock > 0) return 1;
    if (a.stock < 5 && b.stock >= 5) return -1;
    if (b.stock < 5 && a.stock >= 5) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedProducts.map((product) => {
          const status = getStockStatus(product.stock);
          const StatusIcon = status.icon;
          
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium truncate">{product.name}</h4>
                      <Badge variant={status.variant} className="flex items-center gap-1 text-xs">
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Preço de Compra:</span>
                        <span className="font-medium">{formatValue(product.purchasePrice)}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Estoque:</span>
                          <span className="font-medium">{product.stock} unidades</span>
                        </div>
                        
                        {/* Barra de progresso do estoque */}
                        <Progress 
                          value={Math.min((product.stock / 20) * 100, 100)} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Cadastrado em: {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                      className="h-8 w-8 p-0"
                      title="Editar produto"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          onSave={onEditProduct}
        />
      )}
    </>
  );
}