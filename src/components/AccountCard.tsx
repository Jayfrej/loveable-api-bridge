import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Settings, Trash2 } from "lucide-react";
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

interface AccountCardProps {
  account: Account;
}

const AccountCard = ({ account }: AccountCardProps) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <Card className="group hover:shadow-card transition-smooth bg-gradient-surface border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {account.nickname || `Account ${account.account_number}`}
            </h3>
            <p className="text-muted-foreground text-sm">{account.broker}</p>
          </div>
          <Badge variant="outline" className="border-success/30 text-success">
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Account Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Account Number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{account.account_number}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(account.account_number, "Account Number")}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-smooth"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Magic Number</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-trading-gold">{account.magic}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(account.magic.toString(), "Magic Number")}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-smooth"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Webhook Info */}
        <div className="p-3 rounded-lg bg-muted/50 border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Webhook URL</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(account.webhook_path, "Webhook URL")}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs font-mono text-muted-foreground break-all">
            {account.webhook_path}
          </p>
        </div>
        
        {/* Secret Key */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Secret Key</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(account.secret, "Secret Key")}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {account.secret.substring(0, 12)}...
          </p>
        </div>
        
        {/* Created Date */}
        <div className="text-xs text-muted-foreground">
          Created: {new Date(account.created_at).toLocaleDateString()}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Test
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;