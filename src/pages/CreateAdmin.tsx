import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreateAdminUser from "@/components/CreateAdminUser";

const CreateAdmin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
          
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            💰 Lucro Fácil
          </h1>
          <p className="text-muted-foreground mt-2">
            Criação de usuário administrador de teste
          </p>
        </div>

        <CreateAdminUser />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Após criar o admin, acesse{" "}
            <Link to="/auth" className="text-primary hover:underline">
              a página de login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;