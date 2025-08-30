import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";

interface EditProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (productId: string, updates: { name: string; purchasePrice: number; stock: number }) => Promise<void>;
}

export function EditProductDialog({ product, open, onOpenChange, onSave }: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    purchasePrice: product.purchasePrice.toString(),
    stock: product.stock.toString()
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    const stock = parseInt(formData.stock);

    if (isNaN(purchasePrice) || purchasePrice <= 0) {
      toast.error('Preço de compra deve ser um valor válido');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast.error('Estoque deve ser um número válido');
      return;
    }

    try {
      setIsLoading(true);
      await onSave(product.id, {
        name: formData.name.trim(),
        purchasePrice,
        stock
      });
      onOpenChange(false);
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: product.name,
      purchasePrice: product.purchasePrice.toString(),
      stock: product.stock.toString()
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Produto
          </DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias no produto selecionado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome do Produto</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do produto"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-price">Preço de Compra (R$)</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.purchasePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-stock">Estoque</Label>
            <Input
              id="edit-stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              placeholder="0"
            />
          </div>
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
            disabled={isLoading}
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