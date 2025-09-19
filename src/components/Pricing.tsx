import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Zap, 
  Star, 
  Shield, 
  Users, 
  BarChart3,
  Gift,
  CheckCircle,
  Loader2
} from "lucide-react";
import PricingCard from "./PricingCard";
import { toast } from "@/hooks/use-toast";

interface PricingProps {
  apiBaseUrl: string;
}

const Pricing = ({ apiBaseUrl }: PricingProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 29,
      period: "month",
      description: "Perfect for individual traders",
      icon: <Zap className="w-8 h-8 text-primary" />,
      features: [
        "Up to 3 trading accounts",
        "Basic webhook integration",
        "MT5/MT4 support",
        "Email support",
        "Basic analytics",
        "Standard execution speed"
      ]
    },
    {
      id: "pro",
      name: "Professional",
      price: 79,
      period: "month",
      description: "For serious traders and small teams",
      icon: <Crown className="w-8 h-8 text-trading-gold" />,
      popular: true,
      features: [
        "Unlimited trading accounts",
        "Advanced webhook features",
        "Priority execution",
        "24/7 priority support",
        "Advanced analytics & reports",
        "Risk management tools",
        "Custom magic numbers",
        "Multi-broker support"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      period: "month",
      description: "For trading firms and institutions",
      icon: <Shield className="w-8 h-8 text-success" />,
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "SLA guarantees",
        "Advanced security features",
        "API access",
        "Custom reporting"
      ]
    }
  ];

  const handleSubscribe = async (planId: string, period: string) => {
    setIsSubscribing(true);
    
    try {
      const response = await fetch(`${apiBaseUrl}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "demo_user", // In real app, get from auth
          plan: period === "month" ? "monthly" : "yearly"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Subscription Successful!",
          description: `Your ${planId} plan is active until ${data.active_until}`,
        });
      } else {
        throw new Error(data.error || "Subscription failed");
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleRedeemPromo = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a promo code",
        variant: "destructive"
      });
      return;
    }

    setIsRedeeming(true);
    
    try {
      const response = await fetch(`${apiBaseUrl}/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "demo_user", // In real app, get from auth
          code: promoCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Promo Code Redeemed!",
          description: `You received ${data.discount_percent}% discount for ${data.days} days`,
        });
        setPromoCode("");
      } else {
        throw new Error(data.error || "Invalid promo code");
      }
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            <Star className="w-3 h-3 mr-1" />
            Pricing Plans
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Choose Your
            <span className="text-trading-gold block sm:inline sm:ml-3">Trading Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scale your trading operations with our flexible pricing plans designed for traders of all levels
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>

        {/* Promo Code Section */}
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-surface border-border/50">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Have a Promo Code?</h3>
                <p className="text-sm text-muted-foreground">
                  Get additional discounts on your subscription
                </p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="promo">Promo Code</Label>
                  <Input
                    id="promo"
                    placeholder="Enter code (e.g., WELCOME10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                
                <Button 
                  onClick={handleRedeemPromo}
                  disabled={isRedeeming || !promoCode.trim()}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isRedeeming ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redeeming...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 mr-2" />
                      Redeem Code
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-16" />

        {/* Features Comparison */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Why Choose Our Platform?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold">Advanced Analytics</h4>
              <p className="text-muted-foreground">
                Comprehensive trading analytics and performance insights to optimize your strategies
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h4 className="text-lg font-semibold">Bank-Grade Security</h4>
              <p className="text-muted-foreground">
                Your trading data and connections are protected with enterprise-level security measures
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-trading-gold/10 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-trading-gold" />
              </div>
              <h4 className="text-lg font-semibold">24/7 Support</h4>
              <p className="text-muted-foreground">
                Round-the-clock support from our team of trading technology experts
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;