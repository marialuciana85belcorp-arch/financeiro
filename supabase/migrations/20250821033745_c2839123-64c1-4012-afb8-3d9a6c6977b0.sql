-- Criar tabelas para o sistema de vendas e estoque

-- Tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de vendas
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  profile TEXT NOT NULL CHECK (profile IN ('JF', 'Luciana')),
  quantity INTEGER NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  standard_tax DECIMAL(10,2) NOT NULL,
  profile_tax DECIMAL(10,2) NOT NULL,
  net_profit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de despesas
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de boletos
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) - permitindo acesso público por enquanto
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permitir operações públicas (sem autenticação por enquanto)
CREATE POLICY "Allow all operations on products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on sales" ON public.sales FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on bills" ON public.bills FOR ALL USING (true) WITH CHECK (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bills_updated_at
  BEFORE UPDATE ON public.bills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes para performance
CREATE INDEX idx_sales_product_id ON public.sales(product_id);
CREATE INDEX idx_sales_profile ON public.sales(profile);
CREATE INDEX idx_sales_created_at ON public.sales(created_at);
CREATE INDEX idx_bills_status ON public.bills(status);
CREATE INDEX idx_bills_due_date ON public.bills(due_date);
CREATE INDEX idx_expenses_created_at ON public.expenses(created_at);