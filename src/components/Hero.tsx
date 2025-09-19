import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Shield, BarChart3 } from "lucide-react";
import heroImage from "@/assets/trading-hero.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent z-10" />
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Zap className="w-3 h-3 mr-1" />
              Professional Trading
            </Badge>
            <Badge variant="outline" className="border-success/30 text-success">
              MT5/MT4 Integration
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Advanced Trading
            <span className="text-trading-gold block">Platform</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Connect your MetaTrader accounts, manage multiple brokers, and execute trades 
            with precision using our professional-grade platform built for serious traders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold px-8 py-6 text-lg"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start Trading Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-6 text-lg"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Secure</h3>
                <p className="text-sm text-muted-foreground">Bank-grade security</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Fast Execution</h3>
                <p className="text-sm text-muted-foreground">Lightning-fast trades</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border">
              <div className="w-10 h-10 rounded-lg bg-trading-gold/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-trading-gold" />
              </div>
              <div>
                <h3 className="font-semibold">Analytics</h3>
                <p className="text-sm text-muted-foreground">Advanced insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;