import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Save, X, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Sale } from "@/types";

interface EditSaleDialogProps {
  sale: Sale;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (saleId: string, updates: { 
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

export function EditSaleDialog({ sale, open, onOpenChange, onSave, calculateSale }: EditSaleDialogProps) {
  const [formData, setFormData] = useState({
    profile: sale.profile,
    quantity: sale.quantity.toString(),
    salePrice: sale.salePrice.toString()
  });
  const [isLoading, setIsLoading] = useState(false);

  // Calcular preview dos novos valores
  const getPreview = () => {
    const quantity = parseInt(formData.quantity);
    const salePrice = parseFloat(formData.salePrice);
    
    if (isNaN(quantity) || isNaN(salePrice) || quantity <= 0 || salePrice <= 0) {
      return null;
    }

    return calculateSale(salePrice, sale.purchasePrice, quantity, formData.profile, sale.marketplace);
  };

  const preview = getPreview();

  const handleSave = async () => {
    const quantity = parseInt(formData.quantity);
    const salePrice = parseFloat(formData.salePrice);

    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Quantidade deve ser um número válido maior que zero');
      return;
    }

    if (isNaN(salePrice) || salePrice <= 0) {
      toast.error('Preço de venda deve ser um valor válido maior que zero');
      return;
    }

    try {
      setIsLoading(true);
      await onSave(sale.id, {
        profile: formData.profile,
        quantity,
        salePrice
      });
      onOpenChange(false);
      toast.success('Venda atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      toast.error('Erro ao atualizar venda');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      profile: sale.profile,
      quantity: sale.quantity.toString(),
      salePrice: sale.salePrice.toString()
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Venda
          </DialogTitle>
          <DialogDescription>
            Produto: <strong>{sale.productName}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-profile">Perfil</Label>
              <Select
                value={formData.profile}
                onValueChange={(value: 'JF' | 'Luciana') => 
                  setFormData(prev => ({ ...prev, profile: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JF">JF Acessórios</SelectItem>
                  <SelectItem value="Luciana">Luciana Acessórios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantidade</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-sale-price">Preço de Venda (R$)</Label>
            <Input
              id="edit-sale-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.salePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          {/* Preview dos Cálculos */}
          {preview && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Preview dos Novos Cálculos</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Total:</span>
                    <span className="font-medium">R$ {(parseFloat(formData.salePrice) * parseInt(formData.quantity)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa Padrão:</span>
                    <span className="text-orange-600">-R$ {preview.standardTax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa Perfil:</span>
                    <span className="text-orange-600">-R$ {preview.profileTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lucro Líquido:</span>
                    <Badge variant={preview.netProfit > 0 ? "default" : "destructive"}>
                      R$ {preview.netProfit.toFixed(2)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !preview}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}