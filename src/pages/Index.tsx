import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Pricing from "@/components/Pricing";
import ApiConfig from "@/components/ApiConfig";
import RegisterDialog from "@/components/RegisterDialog";

const Index = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState("http://127.0.0.1:5000");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenRegister = () => {
    setIsRegisterOpen(true);
  };

  const handleAccountRegistered = () => {
    // Refresh dashboard when new account is registered
    setRefreshKey(prev => prev + 1);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenRegister={handleOpenRegister} />
      
      <main>
        {/* Hero Section */}
        <Hero onGetStarted={() => scrollToSection('dashboard')} />
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="pricing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Pricing
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" id="dashboard">
              <ScrollArea className="h-full">
                <Dashboard 
                  key={refreshKey}
                  apiBaseUrl={apiBaseUrl} 
                  onOpenRegister={handleOpenRegister}
                />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="pricing" id="pricing">
              <ScrollArea className="h-full">
                <Pricing apiBaseUrl={apiBaseUrl} />
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="settings" id="settings">
              <ScrollArea className="h-full">
                <div className="max-w-2xl">
                  <ApiConfig 
                    apiBaseUrl={apiBaseUrl}
                    onApiUrlChange={setApiBaseUrl}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 4607 Trading Platform. Professional MetaTrader Integration.
          </p>
        </div>
      </footer>

      {/* Register Dialog */}
      <RegisterDialog
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onAccountRegistered={handleAccountRegistered}
        apiBaseUrl={apiBaseUrl}
      />
    </div>
  );
};

export default Index;
