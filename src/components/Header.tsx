import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Settings, User, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header = ({ onOpenRegister }: { onOpenRegister: () => void }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button 
                  onClick={onOpenRegister}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  + เพิ่มบัญชี
                </Button>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;