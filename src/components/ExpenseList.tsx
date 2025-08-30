import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Receipt, Calendar, Edit } from "lucide-react";
import { EditExpenseDialog } from "@/components/EditExpenseDialog";
import type { Expense } from "@/types";

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense: (expenseId: string, updates: { 
    description: string;
    amount: number;
    category: string;
  }) => Promise<void>;
}

export const ExpenseList = ({ expenses, onEditExpense }: ExpenseListProps) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhuma despesa registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Despesas do Mês</h3>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          Total: R$ {totalExpenses.toFixed(2)}
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {expenses.map((expense) => (
          <Card key={expense.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{expense.description}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Receipt className="h-3 w-3" />
                      {expense.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(expense.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline">
                    R$ {expense.amount.toFixed(2)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingExpense(expense)}
                    className="h-8 w-8 p-0"
                    title="Editar despesa"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onSave={onEditExpense}
        />
      )}
    </div>
  );
};