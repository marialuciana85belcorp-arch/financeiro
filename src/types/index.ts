export interface Product {
  id: string;
  name: string;
  purchasePrice: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  profile: 'JF' | 'Luciana';
  marketplace: 'Shopee' | 'Mercado Livre';
  quantity: number;
  salePrice: number;
  purchasePrice: number;
  standardTax: number;
  profileTax: number;
  netProfit: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  createdAt: string;
  updatedAt: string;
}

// Database types for Supabase responses (with Date objects)
export interface ProductDB {
  id: string;
  name: string;
  purchase_price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface SaleDB {
  id: string;
  product_id: string;
  product_name: string;
  profile: 'JF' | 'Luciana';
  marketplace: 'Shopee' | 'Mercado Livre';
  quantity: number;
  sale_price: number;
  purchase_price: number;
  standard_tax: number;
  profile_tax: number;
  net_profit: number;
  created_at: string;
}

export interface ExpenseDB {
  id: string;
  description: string;
  amount: number;
  category: string;
  created_at: string;
}

export interface BillDB {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid';
  created_at: string;
  updated_at: string;
}