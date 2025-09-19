import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountRegistered: () => void;
}

const RegisterDialog = ({ isOpen, onClose, onAccountRegistered }: RegisterDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    trading_platform: "",
    login: "",
    password: "",
    server: "",
    plan: "",
    nickname: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a trading account",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('trading_accounts')
        .insert({
          user_id: user.id,
          trading_platform: formData.trading_platform,
          login: formData.login,
          password: formData.password,
          server: formData.server,
          plan: formData.plan,
          nickname: formData.nickname || `${formData.trading_platform} Account`
        });

      if (error) {
        throw error;
      }

      toast({
        title: "สำเร็จ!",
        description: "เพิ่มบัญชีการซื้อขายเรียบร้อยแล้ว",
      });
      
      setFormData({
        trading_platform: "",
        login: "",
        password: "",
        server: "",
        plan: "",
        nickname: ""
      });
      
      onAccountRegistered();
      onClose();
    } catch (error) {
      console.error('Error adding trading account:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มบัญชีได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            เพิ่มบัญชีการซื้อขาย
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trading_platform">Trading Platform</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, trading_platform: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือก Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MetaTrader 4">MetaTrader 4</SelectItem>
                  <SelectItem value="MetaTrader 5">MetaTrader 5</SelectItem>
                  <SelectItem value="cTrader">cTrader</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                required
                placeholder="Account login"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Account password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="server">Server</Label>
              <Input
                id="server"
                value={formData.server}
                onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                required
                placeholder="Server address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกแผน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="ชื่อเล่นสำหรับบัญชี"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;