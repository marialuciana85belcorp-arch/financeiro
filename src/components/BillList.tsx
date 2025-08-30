import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, CheckCircle, Clock, Edit } from "lucide-react";
import { EditBillDialog } from "@/components/EditBillDialog";
import type { Bill } from "@/types";
import { toast } from "sonner";

interface BillListProps {
  bills: Bill[];
  onUpdateBillStatus: (billId: string, status: 'pending' | 'paid') => void;
  onEditBill: (billId: string, updates: { 
    description: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid';
  }) => Promise<void>;
}

export const BillList = ({ bills, onUpdateBillStatus, onEditBill }: BillListProps) => {
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const pendingBills = bills.filter(bill => bill.status === 'pending');
  const paidBills = bills.filter(bill => bill.status === 'paid');
  
  const totalPending = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = paidBills.reduce((sum, bill) => sum + bill.amount, 0);

  const handleStatusChange = (billId: string, currentStatus: 'pending' | 'paid') => {
    const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
    onUpdateBillStatus(billId, newStatus);
    toast.success(`Boleto marcado como ${newStatus === 'paid' ? 'pago' : 'pendente'}`);
  };

  if (bills.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum boleto registrado ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-orange-700">Pendentes</p>
                <p className="text-xl font-bold text-orange-800">R$ {totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-green-700">Pagos</p>
                <p className="text-xl font-bold text-green-800">R$ {totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Boletos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Todos os Boletos</h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {bills
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((bill) => {
              const isOverdue = bill.status === 'pending' && new Date(bill.dueDate) < new Date();
              
              return (
                <Card key={bill.id} className={cn(
                  "shadow-sm",
                  isOverdue && "border-red-200 bg-red-50/30"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{bill.description}</h4>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Vencido
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Vence: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                          </div>
                          <Badge 
                            variant={bill.status === 'paid' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {bill.status === 'paid' ? 'Pago' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-lg">R$ {bill.amount.toFixed(2)}</p>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingBill(bill)}
                          title="Editar boleto"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={bill.status === 'paid' ? 'outline' : 'default'}
                          onClick={() => handleStatusChange(bill.id, bill.status)}
                        >
                          {bill.status === 'paid' ? 
                            <Clock className="h-4 w-4" /> : 
                            <CheckCircle className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
      
      {editingBill && (
        <EditBillDialog
          bill={editingBill}
          open={!!editingBill}
          onOpenChange={(open) => !open && setEditingBill(null)}
          onSave={onEditBill}
        />
      )}
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}