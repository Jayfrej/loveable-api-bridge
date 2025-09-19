import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Plus, 
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import AccountCard from "./AccountCard";
import { toast } from "@/hooks/use-toast";

interface Account {
  user_id: string;
  account_number: string;
  broker: string;
  nickname: string;
  webhook_path: string;
  secret: string;
  magic: number;
  created_at: string;
}

interface DashboardProps {
  apiBaseUrl: string;
  onOpenRegister: () => void;
}

const Dashboard = ({ apiBaseUrl, onOpenRegister }: DashboardProps) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  const checkServerHealth = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/health`);
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const loadAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/accounts`);
      const data = await response.json();
      
      if (response.ok) {
        setAccounts(data.accounts || []);
      } else {
        throw new Error(data.error || 'Failed to load accounts');
      }
    } catch (error) {
      toast({
        title: "Error Loading Accounts",
        description: error instanceof Error ? error.message : "Could not connect to server",
        variant: "destructive"
      });
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkServerHealth();
    loadAccounts();
  }, [apiBaseUrl]);

  const stats = [
    {
      title: "Total Accounts",
      value: accounts.length.toString(),
      icon: Users,
      change: "+2 this week",
      positive: true
    },
    {
      title: "Active Connections",
      value: accounts.length.toString(),
      icon: Activity,
      change: "All connected",
      positive: true
    },
    {
      title: "Server Status",
      value: serverStatus === 'online' ? 'Online' : serverStatus === 'offline' ? 'Offline' : 'Checking...',
      icon: serverStatus === 'online' ? CheckCircle : AlertCircle,
      change: serverStatus === 'online' ? "Operational" : "Check connection",
      positive: serverStatus === 'online'
    },
    {
      title: "Platform",
      value: "MT5/MT4",
      icon: TrendingUp,
      change: "Multi-platform",
      positive: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-surface border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <p className={`text-xs mt-1 ${
                    stat.positive ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.positive ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.positive ? 'text-success' : 'text-destructive'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Accounts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Trading Accounts</h2>
            <p className="text-muted-foreground">Manage your MetaTrader connections</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                checkServerHealth();
                loadAccounts();
              }}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={onOpenRegister} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Server Status Card */}
        <Card className={`border-l-4 ${
          serverStatus === 'online' 
            ? 'border-l-success bg-success/5' 
            : 'border-l-destructive bg-destructive/5'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {serverStatus === 'online' ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                <div>
                  <p className="font-medium">Backend Server</p>
                  <p className="text-sm text-muted-foreground">
                    {serverStatus === 'online' 
                      ? 'Connected and operational' 
                      : 'Unable to connect to trading server'
                    }
                  </p>
                </div>
              </div>
              <Badge variant={serverStatus === 'online' ? 'default' : 'destructive'}>
                {serverStatus === 'online' ? 'Online' : 'Offline'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Accounts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account, index) => (
              <AccountCard key={index} account={account} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-border/50">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No accounts registered</h3>
              <p className="text-muted-foreground mb-6">
                Register your first MetaTrader account to start trading
              </p>
              <Button onClick={onOpenRegister} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Register First Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;