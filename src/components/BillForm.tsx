import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Bill } from "@/types";

interface BillFormProps {
  onSubmit: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const BillForm = ({ onSubmit }: BillFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !dueDate) {
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
      dueDate: dueDate.toISOString().split('T')[0], // Convert to string format YYYY-MM-DD
      status
    });

    setDescription("");
    setAmount("");
    setDueDate(undefined);
    setStatus('pending');
    toast.success("Boleto registrado com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Boleto</Label>
        <Input
          id="description"
          placeholder="Ex: Aluguel, Energia, Fornecedor..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        <Label>Data de Vencimento</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(value: 'pending' | 'paid') => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="paid">Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Registrar Boleto
      </Button>
    </form>
  );
};