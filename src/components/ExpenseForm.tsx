import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Expense } from "@/types";

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

export const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("O valor deve ser maior que zero");
      return;
    }

    onSubmit({
      description,
      amount: parseFloat(amount),
      category
    });

    setDescription("");
    setAmount("");
    setCategory("");
    toast.success("Despesa registrada com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          placeholder="Ex: Compra de mercadoria, material de escritório..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Input
          id="category"
          placeholder="Ex: Mercadoria, Marketing, Escritório..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Registrar Despesa
      </Button>
    </form>
  );
};