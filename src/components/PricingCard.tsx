import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Star } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSubscribe: (planId: string, period: string) => void;
}

const PricingCard = ({ plan, onSubscribe }: PricingCardProps) => {
  return (
    <Card className={`relative group transition-smooth ${
      plan.popular 
        ? 'border-primary/50 shadow-gold bg-gradient-to-b from-primary/5 to-transparent' 
        : 'border-border hover:border-primary/30'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            plan.popular ? 'bg-primary/20' : 'bg-muted/50'
          }`}>
            {plan.icon}
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
        
        <div className="mt-6">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-bold text-trading-gold">${plan.price}</span>
            <span className="text-muted-foreground">/{plan.period}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Features */}
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-success" />
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={() => onSubscribe(plan.id, plan.period)}
          className={`w-full py-6 text-lg font-medium transition-smooth ${
            plan.popular 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {plan.popular ? (
            <>
              <Crown className="w-5 h-5 mr-2" />
              Get Started
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Choose Plan
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Cancel anytime • 30-day money back guarantee
        </p>
      </CardContent>
    </Card>
  );
};

export default PricingCard;