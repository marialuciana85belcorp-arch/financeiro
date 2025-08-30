-- EXECUTE ESTE SCRIPT NO PAINEL DO SUPABASE (SQL Editor)
-- Para corrigir o problema de registro de vendas do Mercado Livre

-- 1. Adicionar coluna marketplace à tabela sales
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS marketplace TEXT NOT NULL DEFAULT 'Shopee' 
CHECK (marketplace IN ('Shopee', 'Mercado Livre'));

-- 2. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_sales_marketplace ON public.sales(marketplace);

-- 3. Comentário explicativo
COMMENT ON COLUMN public.sales.marketplace IS 'Marketplace onde a venda foi realizada (Shopee ou Mercado Livre)';

-- 4. Verificar se a coluna foi criada corretamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'sales' AND column_name = 'marketplace';

-- INSTRUÇÕES:
-- 1. Acesse o painel do Supabase: https://supabase.com/dashboard
-- 2. Vá para o projeto: xtrlmydcxygfbpivwpjn
-- 3. Clique em "SQL Editor" no menu lateral
-- 4. Cole e execute este script
-- 5. Verifique se a última query retorna uma linha com a coluna marketplace