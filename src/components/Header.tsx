import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Settings, User, Bell } from "lucide-react";

interface HeaderProps {
  onOpenRegister: () => void;
}

const Header = ({ onOpenRegister }: HeaderProps) => {
  const [notifications] = useState(2);

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-trading-gold">4607 Trading</h1>
              <p className="text-xs text-muted-foreground">Professional Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#dashboard" className="text-foreground hover:text-primary transition-smooth">
              Dashboard
            </a>
            <a href="#accounts" className="text-foreground hover:text-primary transition-smooth">
              Accounts
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-smooth">
              Pricing
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-destructive">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </div>
            
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button onClick={onOpenRegister} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold">
              <User className="w-4 h-4 mr-2" />
              Register Account
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;