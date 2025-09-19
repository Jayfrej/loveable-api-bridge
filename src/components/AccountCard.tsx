import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Settings, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface AccountCardProps {
  account: TradingAccount;
  onAccountDeleted: () => void;
}

const AccountCard = ({ account, onAccountDeleted }: AccountCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete this trading account?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('trading_accounts')
        .delete()
        .eq('id', account.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Account Deleted",
        description: "Trading account has been successfully deleted",
      });

      onAccountDeleted();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete trading account",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-foreground">
              {account.nickname || `${account.trading_platform} Account`}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {account.trading_platform} • {account.server}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {account.plan}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Login:</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                {account.login}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(account.login)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Server:</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                {account.server.length > 15 ? `${account.server.slice(0, 15)}...` : account.server}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => copyToClipboard(account.server)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Created:</span>
            <span className="text-xs text-foreground">
              {new Date(account.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1 border-border">
            <Settings className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-border text-red-500 hover:text-red-600"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;