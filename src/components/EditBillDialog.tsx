import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import type { Bill } from "@/types";

interface EditBillDialogProps {
  bill: Bill;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (billId: string, updates: { 
    description: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid';
  }) => Promise<void>;
}

export function EditBillDialog({ bill, open, onOpenChange, onSave }: EditBillDialogProps) {
  const [formData, setFormData] = useState({
    description: bill.description,
    amount: bill.amount.toString(),
    dueDate: bill.dueDate,
    status: bill.status
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Valor deve ser um número válido maior que zero');
      return;
    }

    if (!formData.dueDate) {
      toast.error('Data de vencimento é obrigatória');
      return;
    }

    try {
      setIsLoading(true);
      await onSave(bill.id, {
        description: formData.description.trim(),
        amount,
        dueDate: formData.dueDate,
        status: formData.status
      });
      onOpenChange(false);
      toast.success('Boleto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar boleto:', error);
      toast.error('Erro ao atualizar boleto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      description: bill.description,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate,
      status: bill.status
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Boleto
          </DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias no boleto selecionado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição</Label>
            <Input
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do boleto"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Valor (R$)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-due-date">Data de Vencimento</Label>
            <Input
              id="edit-due-date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'pending' | 'paid') => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
              </SelectContent>
            </Select>
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