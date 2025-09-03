import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, TrendingUp, DollarSign, Users, BarChart3, Plus, Eye, Calculator, Receipt, CreditCard, LogOut } from "lucide-react";
import { ProductForm } from "@/components/ProductForm";
import { SaleForm } from "@/components/SaleForm";
import { Dashboard } from "@/components/Dashboard";
import { Reports } from "@/components/Reports";
import { ProductList } from "@/components/ProductList";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { BillForm } from "@/components/BillForm";
import { BillList } from "@/components/BillList";
import { TotalRevenue } from "@/components/TotalRevenue";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PrivacyToggle } from "@/components/PrivacyToggle";
import { SalesList } from "@/components/SalesList";
import { TaxSettings, useTaxConfig } from "@/components/TaxSettings";
import { MonthSelector } from "@/components/MonthSelector";
import type { Product, Sale, Expense, Bill, ProductDB, SaleDB, ExpenseDB, BillDB } from "@/types";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [isFinancialDataVisible, setIsFinancialDataVisible] = useState(true);
  const { config: taxConfig, setConfig: setTaxConfig, calculateSale } = useTaxConfig();
  const navigate = useNavigate();
  
  // Estado para o mês selecionado
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Carregar dados iniciais do Supabase
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadSales(), loadExpenses(), loadBills()]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados do sistema');
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (productId: string, updates: { name: string; purchasePrice: number; stock: number }) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          purchase_price: updates.purchasePrice,
          stock: updates.stock
        })
        .eq('id', productId);

      if (error) {
        console.error('Erro ao atualizar produto:', error);
        toast.error('Erro ao atualizar produto');
        return;
      }

      // Atualizar estado local
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, ...updates }
            : p
        )
      );

      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto');
    }
  };

  const editSale = async (saleId: string, updates: { 
    profile: 'JF' | 'Luciana';
    quantity: number;
    salePrice: number;
  }) => {
    try {
      const sale = sales.find(s => s.id === saleId);
      if (!sale) {
        toast.error('Venda não encontrada');
        return;
      }

      const calculations = calculateSale(updates.salePrice, sale.purchasePrice, updates.quantity, updates.profile, sale.marketplace);

      const { error } = await supabase
        .from('sales')
        .update({
          profile: updates.profile,
          quantity: updates.quantity,
          sale_price: updates.salePrice,
          standard_tax: calculations.standardTax,
          profile_tax: calculations.profileTax,
          net_profit: calculations.netProfit
        })
        .eq('id', saleId);

      if (error) {
        console.error('Erro ao atualizar venda:', error);
        toast.error('Erro ao atualizar venda');
        return;
      }

      // Atualizar estado local
      setSales(prevSales => 
        prevSales.map(s => 
          s.id === saleId 
            ? { 
                ...s, 
                ...updates,
                standardTax: calculations.standardTax,
                profileTax: calculations.profileTax,
                netProfit: calculations.netProfit
              }
            : s
        )
      );

      toast.success('Venda atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar venda:', error);
      toast.error('Erro ao atualizar venda');
    }
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
      return;
    }

    const formattedProducts: Product[] = data.map((item: ProductDB) => ({
      id: item.id,
      name: item.name,
      purchasePrice: parseFloat(item.purchase_price.toString()),
      stock: item.stock,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    setProducts(formattedProducts);
  };

  const loadSales = async () => {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao carregar vendas:', error);
      toast.error('Erro ao carregar vendas');
      return;
    }

    const formattedSales: Sale[] = data.map((item: SaleDB) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      profile: item.profile as 'JF' | 'Luciana',
      marketplace: (item.marketplace as 'Shopee' | 'Mercado Livre') || 'Shopee', // Default para compatibilidade
      quantity: item.quantity,
      salePrice: parseFloat(item.sale_price.toString()),
      purchasePrice: parseFloat(item.purchase_price.toString()),
      standardTax: parseFloat(item.standard_tax.toString()),
      profileTax: parseFloat(item.profile_tax.toString()),
      netProfit: parseFloat(item.net_profit.toString()),
      createdAt: item.created_at
    }));
    setSales(formattedSales);
  };

  const loadExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao carregar despesas:', error);
      toast.error('Erro ao carregar despesas');
      return;
    }

    const formattedExpenses: Expense[] = data.map((item: ExpenseDB) => ({
      id: item.id,
      description: item.description,
      amount: parseFloat(item.amount.toString()),
      category: item.category,
      createdAt: item.created_at
    }));
    setExpenses(formattedExpenses);
  };

  const loadBills = async () => {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Erro ao carregar boletos:', error);
      toast.error('Erro ao carregar boletos');
      return;
    }

    const formattedBills: Bill[] = data.map((item: BillDB) => ({
      id: item.id,
      description: item.description,
      amount: parseFloat(item.amount.toString()),
      dueDate: item.due_date,
      status: item.status as 'pending' | 'paid',
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
    setBills(formattedBills);
  };

  // Função para calcular taxas e lucro
  // A função calculateSale agora vem do hook useTaxConfig()

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          purchase_price: product.purchasePrice,
          stock: product.stock
        });

      if (error) {
        console.error('Erro ao adicionar produto:', error);
        toast.error('Erro ao adicionar produto');
        return;
      }

      toast.success('Produto adicionado com sucesso!');
      await loadProducts();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast.error('Erro ao adicionar produto');
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'createdAt' | 'standardTax' | 'profileTax' | 'netProfit'>) => {
    try {
      // Mostrar loading
      toast.loading('Registrando venda...');
      
      const calculations = calculateSale(sale.salePrice, sale.purchasePrice, sale.quantity, sale.profile, sale.marketplace);

      // Verificar estoque antes de inserir
      const currentProduct = products.find(p => p.id === sale.productId);
      if (!currentProduct) {
        toast.error('Produto não encontrado');
        return;
      }

      if (currentProduct.stock < sale.quantity) {
        toast.error('Estoque insuficiente');
        return;
      }

      // Usar transação para garantir consistência
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          product_id: sale.productId,
          product_name: sale.productName,
          profile: sale.profile,
          marketplace: sale.marketplace,
          quantity: sale.quantity,
          sale_price: sale.salePrice,
          purchase_price: sale.purchasePrice,
          standard_tax: calculations.standardTax,
          profile_tax: calculations.profileTax,
          net_profit: calculations.netProfit
        })
        .select()
        .single();

      if (saleError) {
        console.error('Erro ao adicionar venda:', saleError);
        toast.error('Erro ao adicionar venda: ' + saleError.message);
        return;
      }

      // Atualizar estoque do produto
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: currentProduct.stock - sale.quantity })
        .eq('id', sale.productId);

      if (updateError) {
        console.error('Erro ao atualizar estoque:', updateError);
        toast.error('Erro ao atualizar estoque: ' + updateError.message);
        return;
      }

      // Atualizar estado local imediatamente para melhor UX
      const newSale: Sale = {
        id: saleData.id,
        productId: sale.productId,
        productName: sale.productName,
        profile: sale.profile,
        marketplace: sale.marketplace,
        quantity: sale.quantity,
        salePrice: sale.salePrice,
        purchasePrice: sale.purchasePrice,
        standardTax: calculations.standardTax,
        profileTax: calculations.profileTax,
        netProfit: calculations.netProfit,
        createdAt: saleData.created_at
      };

      // Atualizar estados locais imediatamente
      setSales(prevSales => [newSale, ...prevSales]);
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === sale.productId 
            ? { ...p, stock: p.stock - sale.quantity }
            : p
        )
      );

      toast.success('Venda registrada com sucesso!');
      
      // Recarregar dados em background para garantir sincronização
      setTimeout(() => {
        Promise.all([loadSales(), loadProducts()]).catch(console.error);
      }, 500);
      
    } catch (error) {
      console.error('Erro ao adicionar venda:', error);
      toast.error('Erro inesperado ao adicionar venda');
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          description: expense.description,
          amount: expense.amount,
          category: expense.category
        });

      if (error) {
        console.error('Erro ao adicionar despesa:', error);
        toast.error('Erro ao adicionar despesa');
        return;
      }

      toast.success('Despesa registrada com sucesso!');
      await loadExpenses();
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      toast.error('Erro ao adicionar despesa');
    }
  };

  const addBill = async (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('bills')
        .insert({
          description: bill.description,
          amount: bill.amount,
          due_date: bill.dueDate,
          status: bill.status
        });

      if (error) {
        console.error('Erro ao adicionar boleto:', error);
        toast.error('Erro ao adicionar boleto');
        return;
      }

      toast.success('Boleto registrado com sucesso!');
      await loadBills();
    } catch (error) {
      console.error('Erro ao adicionar boleto:', error);
      toast.error('Erro ao adicionar boleto');
    }
  };

  const editExpense = async (expenseId: string, updates: { 
    description: string;
    amount: number;
    category: string;
  }) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          description: updates.description,
          amount: updates.amount,
          category: updates.category
        })
        .eq('id', expenseId);

      if (error) {
        console.error('Erro ao atualizar despesa:', error);
        toast.error('Erro ao atualizar despesa');
        return;
      }

      // Atualizar estado local
      setExpenses(prevExpenses => 
        prevExpenses.map(e => 
          e.id === expenseId 
            ? { ...e, ...updates }
            : e
        )
      );

      toast.success('Despesa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      toast.error('Erro ao atualizar despesa');
    }
  };

  const editBill = async (billId: string, updates: { 
    description: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid';
  }) => {
    try {
      const { error } = await supabase
        .from('bills')
        .update({
          description: updates.description,
          amount: updates.amount,
          due_date: updates.dueDate,
          status: updates.status
        })
        .eq('id', billId);

      if (error) {
        console.error('Erro ao atualizar boleto:', error);
        toast.error('Erro ao atualizar boleto');
        return;
      }

      // Atualizar estado local
      setBills(prevBills => 
        prevBills.map(b => 
          b.id === billId 
            ? { ...b, description: updates.description, amount: updates.amount, dueDate: updates.dueDate, status: updates.status }
            : b
        )
      );

      toast.success('Boleto atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar boleto:', error);
      toast.error('Erro ao atualizar boleto');
    }
  };

  const updateBillStatus = async (billId: string, status: 'pending' | 'paid') => {
    try {
      const { error } = await supabase
        .from('bills')
        .update({ status })
        .eq('id', billId);

      if (error) {
        console.error('Erro ao atualizar status do boleto:', error);
        toast.error('Erro ao atualizar status do boleto');
        return;
      }

      await loadBills();
    } catch (error) {
      console.error('Erro ao atualizar status do boleto:', error);
      toast.error('Erro ao atualizar status do boleto');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  // Filtrar dados pelo mês selecionado
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      const saleMonth = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      return saleMonth === selectedMonth;
    });
  }, [sales, selectedMonth]);
  
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.createdAt);
      const expenseMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      return expenseMonth === selectedMonth;
    });
  }, [expenses, selectedMonth]);
  
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const billDate = new Date(bill.dueDate);
      const billMonth = `${billDate.getFullYear()}-${String(billDate.getMonth() + 1).padStart(2, '0')}`;
      return billMonth === selectedMonth;
    });
  }, [bills, selectedMonth]);

  // Calcular totais para o dashboard com base nos dados filtrados
  const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.salePrice * sale.quantity), 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.netProfit, 0);
  const totalTaxes = filteredSales.reduce((sum, sale) => sum + sale.standardTax + sale.profileTax, 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-card shadow-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                💰 Lucro Fácil
              </h1>
              <p className="text-muted-foreground mt-1">
                Sistema de Controle Financeiro Inteligente
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                2 Perfis Ativos
              </Badge>
              <Badge variant="outline" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {totalProducts} Produtos
              </Badge>
              <PrivacyToggle onToggle={setIsFinancialDataVisible} />
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-end mb-4">
          <MonthSelector sales={sales} onMonthChange={setSelectedMonth} />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-9 bg-muted/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <DollarSign className="h-4 w-4" />
              Receita Total
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <ShoppingBag className="h-4 w-4" />
              Vendas
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <Calculator className="h-4 w-4" />
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <Receipt className="h-4 w-4" />
              Despesas
            </TabsTrigger>
            <TabsTrigger value="bills" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <CreditCard className="h-4 w-4" />
              Boletos
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              <Calculator className="h-4 w-4" />
              Impostos
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard 
              totalSales={totalSales} 
              totalProfit={totalProfit} 
              totalTaxes={totalTaxes} 
              totalProducts={totalProducts} 
              lowStockProducts={lowStockProducts} 
              sales={filteredSales} 
              products={products} 
            />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <TotalRevenue 
              sales={filteredSales}
              expenses={filteredExpenses}
              bills={filteredBills}
            />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Cadastrar Produto
                  </CardTitle>
                  <CardDescription>
                    Adicione novos produtos ao estoque compartilhado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductForm onSubmit={addProduct} />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Lista de Produtos
                  </CardTitle>
                  <CardDescription>
                    Visualize e gerencie o estoque atual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductList products={products} onEditProduct={editProduct} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Registrar Venda
                  </CardTitle>
                  <CardDescription>
                    Registre uma nova venda com cálculo automático de taxas e lucros
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SaleForm products={products} onSubmit={addSale} calculateSale={calculateSale} />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Vendas Recentes
                  </CardTitle>
                  <CardDescription>
                    Visualize e edite as vendas registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesList 
                    sales={sales.slice(0, 10)} 
                    onEditSale={editSale}
                    calculateSale={calculateSale}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Reports sales={sales} />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculadora de Lucros
                </CardTitle>
                <CardDescription>
                  Simule vendas e veja os cálculos de taxas e lucros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-6 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-lg">Regras de Cálculo:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Taxa Padrão:</strong> 20% do valor da venda + R$ 4,00 por produto + 1% adicional</p>
                    <p><strong>JF Acessórios:</strong> + 8% de imposto sobre o valor da venda</p>
                    <p><strong>Luciana Acessórios:</strong> + 7% de imposto sobre o valor da venda</p>
                    <p><strong>Lucro Líquido:</strong> Valor da venda - Valor de compra - Todas as taxas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Registrar Despesa
                  </CardTitle>
                  <CardDescription>
                    Adicione despesas do mês para controle financeiro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseForm onSubmit={addExpense} />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Histórico de Despesas
                  </CardTitle>
                  <CardDescription>
                    Visualize todas as despesas registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseList expenses={expenses} onEditExpense={editExpense} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bills" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Registrar Boleto
                  </CardTitle>
                  <CardDescription>
                    Adicione boletos com data de vencimento e status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BillForm onSubmit={addBill} />
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Gestão de Boletos
                  </CardTitle>
                  <CardDescription>
                    Controle boletos pendentes e pagos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BillList bills={bills} onUpdateBillStatus={updateBillStatus} onEditBill={editBill} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Configurações de Impostos
                </CardTitle>
                <CardDescription>
                  Configure as taxas e impostos para cálculo automático
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <TaxSettings onConfigChange={setTaxConfig} />
               </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;