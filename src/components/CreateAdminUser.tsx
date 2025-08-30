import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateAdminUser = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  const createAdminUser = async () => {
    setIsCreating(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@teste.com',
        password: '123456',
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        toast.error(`Erro ao criar admin: ${error.message}`);
        console.error('Erro:', error);
      } else {
        setAdminCreated(true);
        toast.success('Usuário administrador criado com sucesso!');
        console.log('✅ Admin criado:', data);
      }
    } catch (err) {
      toast.error('Erro inesperado ao criar usuário');
      console.error('Erro:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Criar Admin de Teste
        </CardTitle>
        <CardDescription>
          Crie um usuário administrador para testar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Email:</span>
            <Badge variant="outline">admin@teste.com</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Senha:</span>
            <Badge variant="outline">123456</Badge>
          </div>
        </div>

        {adminCreated ? (
          <div className="text-center space-y-3">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <p className="text-sm font-medium text-green-700">Admin criado com sucesso!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use as credenciais acima para fazer login
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium">Importante:</p>
                  <p>O Supabase pode enviar um email de confirmação. Verifique sua caixa de entrada ou configure o projeto para não exigir confirmação.</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={createAdminUser}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Usuário Admin
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CreateAdminUser;