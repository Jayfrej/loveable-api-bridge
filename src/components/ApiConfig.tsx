import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Server, CheckCircle, AlertCircle, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApiConfigProps {
  apiBaseUrl: string;
  onApiUrlChange: (url: string) => void;
}

const ApiConfig = ({ apiBaseUrl, onApiUrlChange }: ApiConfigProps) => {
  const [tempUrl, setTempUrl] = useState(apiBaseUrl);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');

  const testConnection = async (url: string) => {
    setIsTestingConnection(true);
    setConnectionStatus('unknown');
    
    try {
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('connected');
        toast({
          title: "Connection Successful",
          description: `Connected to ${data.platform || 'trading'} server`,
        });
        return true;
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      setConnectionStatus('failed');
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Could not connect to server",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveConfig = async () => {
    const trimmedUrl = tempUrl.trim().replace(/\/$/, ''); // Remove trailing slash
    
    if (!trimmedUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid API URL",
        variant: "destructive"
      });
      return;
    }

    // Test connection first
    const isConnected = await testConnection(trimmedUrl);
    
    if (isConnected) {
      onApiUrlChange(trimmedUrl);
      toast({
        title: "Configuration Saved",
        description: "API configuration updated successfully",
      });
    }
  };

  const presetUrls = [
    {
      name: "Local Development",
      url: "http://127.0.0.1:5000",
      description: "Flask server running locally"
    },
    {
      name: "Localhost Alternative",
      url: "http://localhost:5000", 
      description: "Alternative local address"
    },
    {
      name: "Custom Server",
      url: "https://your-domain.com",
      description: "Your production server"
    }
  ];

  return (
    <Card className="bg-gradient-surface border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-3">
            <Server className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Current API URL</p>
              <p className="text-xs text-muted-foreground font-mono">{apiBaseUrl}</p>
            </div>
          </div>
          <Badge variant={connectionStatus === 'connected' ? 'default' : connectionStatus === 'failed' ? 'destructive' : 'secondary'}>
            {connectionStatus === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
            {connectionStatus === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
            {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'failed' ? 'Failed' : 'Unknown'}
          </Badge>
        </div>

        {/* URL Input */}
        <div className="space-y-3">
          <Label htmlFor="api-url">Backend Server URL</Label>
          <div className="flex gap-2">
            <Input
              id="api-url"
              placeholder="http://127.0.0.1:5000"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="bg-input border-border font-mono text-sm"
            />
            <Button 
              onClick={() => testConnection(tempUrl)}
              disabled={isTestingConnection}
              variant="outline"
              className="px-4"
            >
              {isTestingConnection ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                "Test"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the URL where your Flask trading server is running
          </p>
        </div>

        {/* Preset URLs */}
        <div className="space-y-3">
          <Label>Quick Presets</Label>
          <div className="grid gap-2">
            {presetUrls.map((preset, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-smooth cursor-pointer"
                onClick={() => setTempUrl(preset.url)}
              >
                <div>
                  <p className="text-sm font-medium">{preset.name}</p>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded">{preset.url}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSaveConfig}
            disabled={isTestingConnection}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>

        {/* Help Text */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Make sure your Flask server is running and accessible. 
            The server should respond to <code>/health</code> endpoint for connection testing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConfig;