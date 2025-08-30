import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ShoppingBag, Calculator, DollarSign } from "lucide-react";
import type { Product } from "@/types";

interface SaleFormProps {
  products: Product[];
  onSubmit: (sale: {
    productId: string;
    productName: string;
    profile: 'JF' | 'Luciana';
    marketplace: 'Shopee' | 'Mercado Livre';
    quantity: number;
    salePrice: number;
    purchasePrice: number;
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

export function SaleForm({ products, onSubmit, calculateSale }: SaleFormProps) {
  const [formData, setFormData] = useState({
    productId: "",
    profile: "" as 'JF' | 'Luciana' | "",
    marketplace: "" as 'Shopee' | 'Mercado Livre' | "",
    quantity: "",
    salePrice: ""
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [preview, setPreview] = useState<{
    standardTax: number;
    profileTax: number;
    netProfit: number;
    saleTotal: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId, products]);

  useEffect(() => {
    if (selectedProduct && formData.profile && formData.marketplace && formData.quantity && formData.salePrice) {
      const quantity = parseInt(formData.quantity);
      const salePrice = parseFloat(formData.salePrice);
      
      if (!isNaN(quantity) && !isNaN(salePrice) && quantity > 0 && salePrice > 0) {
        const calculations = calculateSale(salePrice, selectedProduct.purchasePrice, quantity, formData.profile, formData.marketplace);
        setPreview({
          ...calculations,
          saleTotal: salePrice * quantity
        });
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [selectedProduct, formData, calculateSale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.productId || !formData.profile || !formData.marketplace || !formData.quantity || !formData.salePrice) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(formData.quantity);
    const salePrice = parseFloat(formData.salePrice);

    if (!selectedProduct) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive"
      });
      return;
    }

    if (quantity > selectedProduct.stock) {
      toast({
        title: "Estoque Insuficiente",
        description: `Apenas ${selectedProduct.stock} unidades disponíveis`,
        variant: "destructive"
      });
      return;
    }

    if (quantity <= 0 || salePrice <= 0) {
      toast({
        title: "Valores Inválidos",
        description: "Quantidade e preço devem ser maiores que zero",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await onSubmit({
        productId: formData.productId,
        productName: selectedProduct.name,
        profile: formData.profile,
        marketplace: formData.marketplace,
        quantity,
        salePrice,
        purchasePrice: selectedProduct.purchasePrice
      });

      // Resetar formulário apenas após sucesso
      setFormData({
        productId: "",
        profile: "" as any,
        marketplace: "" as any,
        quantity: "",
        salePrice: ""
      });
      setSelectedProduct(null);
      setPreview(null);
      
    } catch (error) {
      console.error('Erro ao submeter venda:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableProducts = products.filter(p => p.stock > 0);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Estoque: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketplace">Marketplace *</Label>
            <Select
              value={formData.marketplace}
              onValueChange={(value: 'Shopee' | 'Mercado Livre') => setFormData(prev => ({ ...prev, marketplace: value }))}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione o marketplace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shopee">📦 Shopee (Taxa padrão)</SelectItem>
                <SelectItem value="Mercado Livre">🛒 Mercado Livre (11,5%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile">Perfil *</Label>
            <Select
              value={formData.profile}
              onValueChange={(value: 'JF' | 'Luciana') => setFormData(prev => ({ ...prev, profile: value }))}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione o perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JF">
                  JF Acessórios ({formData.marketplace === 'Mercado Livre' ? '8%' : '8%'} imposto)
                </SelectItem>
                <SelectItem value="Luciana">
                  Luciana Acessórios ({formData.marketplace === 'Mercado Livre' ? '7%' : '7%'} imposto)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedProduct?.stock || 999}
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              className="bg-background"
            />
            {selectedProduct && (
              <p className="text-sm text-muted-foreground">
                Estoque disponível: {selectedProduct.stock} unidades
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="salePrice">Preço de Venda (R$) *</Label>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.salePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
              className="bg-background"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary hover:shadow-primary transition-all duration-300"
          disabled={!preview || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Registrando...
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Registrar Venda
            </>
          )}
        </Button>
      </form>

      {/* Preview da Venda */}
      {preview && selectedProduct && (
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Cálculo da Venda</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor Total da Venda:</span>
                  <span className="font-medium">R$ {preview.saleTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Custo de Compra:</span>
                  <span className="font-medium">R$ {(selectedProduct.purchasePrice * parseInt(formData.quantity || "0")).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa Padrão:</span>
                  <span className="font-medium text-warning">-R$ {preview.standardTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Taxa do Perfil:</span>
                  <span className="font-medium text-warning">-R$ {preview.profileTax.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Lucro Líquido:</span>
                <Badge 
                  variant={preview.netProfit > 0 ? "default" : "destructive"}
                  className="text-lg px-3 py-1"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  R$ {preview.netProfit.toFixed(2)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}