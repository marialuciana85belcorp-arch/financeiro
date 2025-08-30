-- Adicionar coluna marketplace à tabela sales
ALTER TABLE public.sales 
ADD COLUMN marketplace TEXT NOT NULL DEFAULT 'Shopee' 
CHECK (marketplace IN ('Shopee', 'Mercado Livre'));

-- Criar índice para performance
CREATE INDEX idx_sales_marketplace ON public.sales(marketplace);

-- Comentário explicativo
COMMENT ON COLUMN public.sales.marketplace IS 'Marketplace onde a venda foi realizada (Shopee ou Mercado Livre)';