// Script simples para criar usuário administrador de teste
// Execute este arquivo no navegador ou use o formulário de registro

console.log('='.repeat(50));
console.log('🔧 CRIAÇÃO DE USUÁRIO ADMINISTRADOR DE TESTE');
console.log('='.repeat(50));
console.log('');
console.log('📋 CREDENCIAIS DO ADMINISTRADOR:');
console.log('📧 Email: admin@teste.com');
console.log('🔑 Senha: 123456');
console.log('');
console.log('📝 INSTRUÇÕES:');
console.log('1. Acesse: http://localhost:8080/auth');
console.log('2. Clique na aba "Criar conta"');
console.log('3. Use as credenciais acima');
console.log('4. Confirme a senha: 123456');
console.log('5. Clique em "Criar conta"');
console.log('');
console.log('⚠️  NOTA: Como o Supabase está configurado para enviar');
console.log('   email de confirmação, você pode precisar:');
console.log('   - Verificar o email (se configurado)');
console.log('   - Ou desabilitar a confirmação por email no Supabase');
console.log('');
console.log('🚀 ALTERNATIVA RÁPIDA:');
console.log('   Execute o código abaixo no console do navegador');
console.log('   (F12 > Console) na página /auth:');
console.log('');
console.log('// Código para executar no console do navegador:');
console.log(`
const createTestAdmin = async () => {
  const { supabase } = await import('./src/integrations/supabase/client.js');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@teste.com',
      password: '123456'
    });
    
    if (error) {
      console.error('Erro:', error.message);
    } else {
      console.log('✅ Usuário criado!', data);
    }
  } catch (err) {
    console.error('Erro:', err);
  }
};

createTestAdmin();
`);
console.log('');
console.log('='.repeat(50));