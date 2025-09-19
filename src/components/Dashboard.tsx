import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Plus, Activity, Users, Server, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AccountCard from "./AccountCard";

// Data structure for trading account
interface TradingAccount {
  id: string;
  user_id: string;
  trading_platform: string;
  login: string;
  server: string;
  plan: string;
  nickname: string | null;
  created_at: string;
}

interface DashboardProps {
  onOpenRegister: () => void;
}

const Dashboard = ({ onOpenRegister }: DashboardProps) => {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to load trading accounts from Supabase
  const loadAccounts = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load trading accounts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount and when user changes
  useEffect(() => {
    loadAccounts();
  }, [user]);

  // Statistics data
  const stats = [
    {
      title: "Total Accounts",
      value: accounts.length.toString(),
      description: "Registered trading accounts",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Active Platforms", 
      value: new Set(accounts.map(acc => acc.trading_platform)).size.toString(),
      description: "Different trading platforms",
      icon: Activity,
      color: "text-green-500"
    },
    {
      title: "Premium Plans",
      value: accounts.filter(acc => acc.plan === 'Premium' || acc.plan === 'Pro').length.toString(),
      description: "Active premium subscriptions",
      icon: Server,
      color: "text-purple-500"
    },
    {
      title: "Platform Type",
      value: "MetaTrader",
      description: "Supported trading platform",
      icon: Zap,
      color: "text-gold"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Status Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
            <div className={`h-2 w-2 rounded-full ${user ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {user ? 'Authenticated' : 'Not Logged In'}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {user ? 'Ready to manage accounts' : 'Please sign in to continue'}
          </p>
        </CardContent>
      </Card>

      {/* Accounts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Trading Accounts</h3>
          <div className="flex gap-2">
            <Button 
              onClick={loadAccounts}
              variant="outline" 
              size="sm"
              className="border-border"
              disabled={!user}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={onOpenRegister}
              size="sm"
              className="bg-primary hover:bg-primary/90"
              disabled={!user}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Account Cards */}
        {!user ? (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Please Sign In</h3>
                <p className="text-muted-foreground mb-4">
                  Sign in with Google to manage your trading accounts
                </p>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-primary hover:bg-primary/90"
                >
                  Sign In with Google
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader>
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : accounts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} onAccountDeleted={loadAccounts} />
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Trading Accounts</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first trading account
                </p>
                <Button 
                  onClick={onOpenRegister}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Account
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;