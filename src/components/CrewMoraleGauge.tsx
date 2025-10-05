import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const CrewMoraleGauge = () => {
  const [morale, setMorale] = useState(78);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorale(prev => {
        const change = (Math.random() - 0.5) * 3;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getMoraleColor = (value: number) => {
    if (value >= 70) return "text-success";
    if (value >= 40) return "text-warning";
    return "text-destructive";
  };

  const getMoraleStatus = (value: number) => {
    if (value >= 70) return "Optimal";
    if (value >= 40) return "Moderate";
    return "Critical";
  };

  return (
    <Card className="p-6 bg-gradient-space border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Collective Crew Morale</h3>
        <p className="text-sm text-muted-foreground mb-6">Quantum-averaged emotional state</p>
        
        <div className="relative">
          <svg viewBox="0 0 200 120" className="w-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Foreground arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={morale >= 70 ? "hsl(var(--success))" : morale >= 40 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(morale / 100) * 251.2} 251.2`}
              className="transition-all duration-1000 drop-shadow-[0_0_8px_currentColor]"
            />
            
            {/* Center text */}
            <text x="100" y="85" textAnchor="middle" className="text-4xl font-bold fill-foreground">
              {Math.round(morale)}%
            </text>
            <text x="100" y="105" textAnchor="middle" className={`text-sm font-medium ${getMoraleColor(morale)}`}>
              {getMoraleStatus(morale)}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{Math.round(morale * 0.4)}</div>
            <div className="text-xs text-muted-foreground">Positive States</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(morale * 0.3)}</div>
            <div className="text-xs text-muted-foreground">Neutral States</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{Math.round(100 - morale)}</div>
            <div className="text-xs text-muted-foreground">Uncertain States</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CrewMoraleGauge;
