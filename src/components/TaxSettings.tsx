import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Save, RotateCcw, Calculator } from "lucide-react";
import { toast } from "sonner";

interface TaxConfig {
  // Taxas para Shopee (usa as taxas padrão existentes)
  standardTaxPercentage: number; // 20%
  standardTaxFixed: number; // R$4 por produto
  standardTaxAdditional: number; // 1%
  jfProfileTax: number; // 8%
  lucianaProfileTax: number; // 7%
  
  // Taxas específicas para Mercado Livre
  mercadoLivreTax: number; // 11.5%
  mercadoLivreFixedTax: number; // R$6.50 por produto
  mercadoLivreJfTax: number; // 8%
  mercadoLivreLucianaTax: number; // 7%
}

interface TaxSettingsProps {
  config?: TaxConfig;
  onConfigChange: (config: TaxConfig) => void;
}

const DEFAULT_CONFIG: TaxConfig = {
  standardTaxPercentage: 20,
  standardTaxFixed: 4,
  standardTaxAdditional: 1,
  jfProfileTax: 8,
  lucianaProfileTax: 7,
  mercadoLivreTax: 11.5,
  mercadoLivreFixedTax: 6.5,
  mercadoLivreJfTax: 8,
  mercadoLivreLucianaTax: 7
};

export function TaxSettings({ config: initialConfig, onConfigChange }: TaxSettingsProps) {
  const [config, setConfig] = useState<TaxConfig>(() => {
    if (initialConfig) return initialConfig;
    const saved = localStorage.getItem('tax-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);

  useEffect(() => {
    localStorage.setItem('tax-config', JSON.stringify(config));
    onConfigChange(config);
  }, [config, onConfigChange]);

  const handleSave = () => {
    // Validações
    if (tempConfig.standardTaxPercentage < 0 || tempConfig.standardTaxPercentage > 100) {
      toast.error('Taxa padrão deve estar entre 0% e 100%');
      return;
    }
    if (tempConfig.standardTaxFixed < 0) {
      toast.error('Taxa fixa deve ser um valor positivo');
      return;
    }
    if (tempConfig.standardTaxAdditional < 0 || tempConfig.standardTaxAdditional > 100) {
      toast.error('Taxa adicional deve estar entre 0% e 100%');
      return;
    }
    if (tempConfig.jfProfileTax < 0 || tempConfig.jfProfileTax > 100) {
      toast.error('Taxa JF deve estar entre 0% e 100%');
      return;
    }
    if (tempConfig.lucianaProfileTax < 0 || tempConfig.lucianaProfileTax > 100) {
      toast.error('Taxa Luciana deve estar entre 0% e 100%');
      return;
    }
    if (tempConfig.mercadoLivreTax < 0 || tempConfig.mercadoLivreTax > 100) {
      toast.error('Taxa Mercado Livre deve estar entre 0% e 100%');
      return;
    }
    if (tempConfig.mercadoLivreFixedTax < 0) {
      toast.error('Taxa fixa Mercado Livre deve ser um valor positivo');
      return;
    }
    if (tempConfig.mercadoLivreJfTax < 0 || tempConfig.mercadoLivreJfTax > 100) {
      toast.error('Taxa JF Mercado Livre deve estar entre 0% e 100%');
      return;
    }
    if (tempConfig.mercadoLivreLucianaTax < 0 || tempConfig.mercadoLivreLucianaTax > 100) {
      toast.error('Taxa Luciana Mercado Livre deve estar entre 0% e 100%');
      return;
    }

    setConfig(tempConfig);
    setIsEditing(false);
    toast.success('Configurações de impostos atualizadas!');
  };

  const handleCancel = () => {
    setTempConfig(config);
    setIsEditing(false);
  };

  const handleReset = () => {
    setTempConfig(DEFAULT_CONFIG);
    toast.info('Valores padrão restaurados (clique em Salvar para confirmar)');
  };

  const calculatePreview = () => {
    const salePrice = 100;
    const quantity = 1;
    const saleTotal = salePrice * quantity;
    
    // Taxas Shopee
    const shopeeTax = saleTotal * (tempConfig.standardTaxPercentage / 100) + 
                     tempConfig.standardTaxFixed * quantity + 
                     saleTotal * (tempConfig.standardTaxAdditional / 100);
    
    const shopeeJfTax = saleTotal * (tempConfig.jfProfileTax / 100);
    const shopeeLucianaTax = saleTotal * (tempConfig.lucianaProfileTax / 100);
    
    // Taxas Mercado Livre
    const mercadoLivreTax = saleTotal * (tempConfig.mercadoLivreTax / 100) + 
                           tempConfig.mercadoLivreFixedTax * quantity;
    
    const mercadoLivreJfTax = saleTotal * (tempConfig.mercadoLivreJfTax / 100);
    const mercadoLivreLucianaTax = saleTotal * (tempConfig.mercadoLivreLucianaTax / 100);
    
    return {
      saleTotal,
      // Shopee
      shopeeTax,
      shopeeJfTax,
      shopeeLucianaTax,
      // Mercado Livre
      mercadoLivreTax,
      mercadoLivreJfTax,
      mercadoLivreLucianaTax
    };
  };

  const preview = calculatePreview();

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações de Impostos
        </CardTitle>
        <CardDescription>
          Configure as taxas e impostos aplicados nos cálculos de vendas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configurações */}
        <div className="space-y-8">
          {/* Taxas Shopee */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                📦 Shopee - Taxa Padrão
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="standard-percentage">Percentual Base (%)</Label>
                  <Input
                    id="standard-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={isEditing ? tempConfig.standardTaxPercentage : config.standardTaxPercentage}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, standardTaxPercentage: parseFloat(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="standard-fixed">Taxa Fixa por Produto (R$)</Label>
                  <Input
                    id="standard-fixed"
                    type="number"
                    min="0"
                    step="0.01"
                    value={isEditing ? tempConfig.standardTaxFixed : config.standardTaxFixed}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, standardTaxFixed: parseFloat(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="standard-additional">Taxa Adicional (%)</Label>
                  <Input
                    id="standard-additional"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={isEditing ? tempConfig.standardTaxAdditional : config.standardTaxAdditional}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, standardTaxAdditional: parseFloat(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                👤 Shopee - Taxas por Perfil
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="jf-tax">JF Acessórios (%)</Label>
                  <Input
                    id="jf-tax"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={isEditing ? tempConfig.jfProfileTax : config.jfProfileTax}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, jfProfileTax: parseFloat(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="luciana-tax">Luciana Acessórios (%)</Label>
                  <Input
                    id="luciana-tax"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={isEditing ? tempConfig.lucianaProfileTax : config.lucianaProfileTax}
                    onChange={(e) => setTempConfig(prev => ({ ...prev, lucianaProfileTax: parseFloat(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Taxas Mercado Livre */}
          <div className="border-t pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  🛒 Mercado Livre - Taxa Base
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="ml-tax">Taxa Mercado Livre (%)</Label>
                    <Input
                      id="ml-tax"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={isEditing ? tempConfig.mercadoLivreTax : config.mercadoLivreTax}
                      onChange={(e) => setTempConfig(prev => ({ ...prev, mercadoLivreTax: parseFloat(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ml-fixed-tax">Taxa Fixa por Produto (R$)</Label>
                    <Input
                      id="ml-fixed-tax"
                      type="number"
                      min="0"
                      step="0.01"
                      value={isEditing ? tempConfig.mercadoLivreFixedTax : config.mercadoLivreFixedTax}
                      onChange={(e) => setTempConfig(prev => ({ ...prev, mercadoLivreFixedTax: parseFloat(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  👤 Mercado Livre - Taxas por Perfil
                </h3>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="ml-jf-tax">JF Acessórios (%)</Label>
                    <Input
                      id="ml-jf-tax"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={isEditing ? tempConfig.mercadoLivreJfTax : config.mercadoLivreJfTax}
                      onChange={(e) => setTempConfig(prev => ({ ...prev, mercadoLivreJfTax: parseFloat(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ml-luciana-tax">Luciana Acessórios (%)</Label>
                    <Input
                      id="ml-luciana-tax"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={isEditing ? tempConfig.mercadoLivreLucianaTax : config.mercadoLivreLucianaTax}
                      onChange={(e) => setTempConfig(prev => ({ ...prev, mercadoLivreLucianaTax: parseFloat(e.target.value) || 0 }))}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview */}
        {isEditing && (
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Preview (Venda de R$ 100,00 - 1 produto)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              {/* Shopee Preview */}
              <div className="space-y-2">
                <h4 className="font-medium text-primary">📦 Shopee</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa Base:</span>
                  <Badge variant="outline">R$ {preview.shopeeTax.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa JF:</span>
                  <Badge variant="outline">R$ {preview.shopeeJfTax.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa Luciana:</span>
                  <Badge variant="outline">R$ {preview.shopeeLucianaTax.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-muted-foreground font-medium">Total JF:</span>
                  <Badge variant="secondary">R$ {(preview.shopeeTax + preview.shopeeJfTax).toFixed(2)}</Badge>
                </div>
              </div>
              
              {/* Mercado Livre Preview */}
              <div className="space-y-2">
                <h4 className="font-medium text-primary">🛒 Mercado Livre</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa Base:</span>
                  <Badge variant="outline">R$ {preview.mercadoLivreTax.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa JF:</span>
                  <Badge variant="outline">R$ {preview.mercadoLivreJfTax.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxa Luciana:</span>
                  <Badge variant="outline">R$ {preview.mercadoLivreLucianaTax.toFixed(2)}</Badge>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-muted-foreground font-medium">Total JF:</span>
                  <Badge variant="secondary">R$ {(preview.mercadoLivreTax + preview.mercadoLivreJfTax).toFixed(2)}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Botões */}
        <div className="flex gap-2 pt-4 border-t">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Editar Configurações
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Restaurar Padrão
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Hook para usar as configurações de impostos
export function useTaxConfig() {
  const [config, setConfig] = useState<TaxConfig>(() => {
    const saved = localStorage.getItem('tax-config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const calculateSale = (salePrice: number, purchasePrice: number, quantity: number, profile: 'JF' | 'Luciana', marketplace: 'Shopee' | 'Mercado Livre' = 'Shopee') => {
    const saleTotal = salePrice * quantity;
    let standardTax = 0;
    let profileTax = 0;

    if (marketplace === 'Shopee') {
      // Taxa padrão para Shopee (usa as configurações existentes)
      standardTax = saleTotal * (config.standardTaxPercentage / 100) + 
                   config.standardTaxFixed * quantity + 
                   saleTotal * (config.standardTaxAdditional / 100);

      // Taxa do perfil para Shopee
      const profileTaxRate = profile === 'JF' ? config.jfProfileTax / 100 : config.lucianaProfileTax / 100;
      profileTax = saleTotal * profileTaxRate;
    } else if (marketplace === 'Mercado Livre') {
      // Taxa base do Mercado Livre (11.5% + R$6.50 por produto)
      standardTax = saleTotal * (config.mercadoLivreTax / 100) + config.mercadoLivreFixedTax * quantity;

      // Taxa do perfil para Mercado Livre (8% JF, 7% Luciana)
      const profileTaxRate = profile === 'JF' ? config.mercadoLivreJfTax / 100 : config.mercadoLivreLucianaTax / 100;
      profileTax = saleTotal * profileTaxRate;
    }

    // Lucro líquido
    const totalCost = purchasePrice * quantity + standardTax + profileTax;
    const netProfit = saleTotal - totalCost;

    return {
      standardTax,
      profileTax,
      netProfit
    };
  };

  return {
    config,
    setConfig,
    calculateSale
  };
}