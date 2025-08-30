import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

interface ProductFormProps {
  onSubmit: (product: {
    name: string;
    purchasePrice: number;
    stock: number;
  }) => void;
}

export function ProductForm({ onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    purchasePrice: "",
    stock: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.purchasePrice || !formData.stock) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    const stock = parseInt(formData.stock);

    if (isNaN(purchasePrice) || purchasePrice <= 0) {
      toast({
        title: "Erro",
        description: "Preço de compra deve ser um valor válido",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast({
        title: "Erro", 
        description: "Estoque deve ser um número válido",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      name: formData.name,
      purchasePrice,
      stock
    });

    setFormData({
      name: "",
      purchasePrice: "",
      stock: ""
    });

    toast({
      title: "Sucesso",
      description: "Produto cadastrado com sucesso!",
      variant: "default"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Produto *</Label>
        <Input
          id="name"
          placeholder="Ex: Anel de prata"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchasePrice">Preço de Compra (R$) *</Label>
        <Input
          id="purchasePrice"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.purchasePrice}
          onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">Estoque Inicial *</Label>
        <Input
          id="stock"
          type="number"
          min="0"
          placeholder="0"
          value={formData.stock}
          onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
          className="bg-background"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-primary hover:shadow-primary transition-all duration-300"
      >
        <Package className="h-4 w-4 mr-2" />
        Cadastrar Produto
      </Button>
    </form>
  );
}