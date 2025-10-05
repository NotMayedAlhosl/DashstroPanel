import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Heart } from "lucide-react";

interface BiometricData {
  heartRate: number;
  stressLevel: number;
  fatigueLevel: number;
  moodScore: number;
  uncertainty: number;
}

interface AstronautCardProps {
  name: string;
  role: string;
  avatar: string;
}

const AstronautCard = ({ name, role, avatar }: AstronautCardProps) => {
  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    stressLevel: 35,
    fatigueLevel: 28,
    moodScore: 75,
    uncertainty: 12,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 5)),
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 8)),
        fatigueLevel: Math.max(0, Math.min(100, prev.fatigueLevel + (Math.random() - 0.5) * 6)),
        moodScore: Math.max(0, Math.min(100, prev.moodScore + (Math.random() - 0.5) * 7)),
        uncertainty: Math.max(5, Math.min(30, prev.uncertainty + (Math.random() - 0.5) * 3)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getMoodStatus = (score: number) => {
    if (score >= 70) return { label: "Positive", color: "bg-success" };
    if (score >= 40) return { label: "Neutral", color: "bg-warning" };
    return { label: "Stressed", color: "bg-destructive" };
  };

  const moodStatus = getMoodStatus(biometrics.moodScore);

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow-primary group">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary transition-colors">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${moodStatus.color} border-2 border-card animate-pulse-glow`} />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
          <Badge variant="outline" className="mt-2 text-xs border-primary/30">
            {moodStatus.label}
          </Badge>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-destructive" />
            <span className="text-muted-foreground">Heart Rate</span>
          </div>
          <span className="font-mono text-foreground">{Math.round(biometrics.heartRate)} bpm</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-warning" />
              <span className="text-muted-foreground">Stress</span>
            </div>
            <span className="font-mono text-foreground">{Math.round(biometrics.stressLevel)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-success to-warning transition-all duration-1000"
              style={{ width: `${biometrics.stressLevel}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Quantum State</span>
            </div>
            <span className="font-mono text-foreground">±{Math.round(biometrics.uncertainty)}%</span>
          </div>
          <div className="h-8 bg-muted rounded overflow-hidden relative">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 animate-shimmer"
              style={{ 
                backgroundSize: '200% 100%',
                width: `${100 + biometrics.uncertainty * 2}%`,
                left: `-${biometrics.uncertainty}%`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="h-6 bg-primary/50 rounded transition-all duration-1000"
                style={{ width: `${biometrics.moodScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AstronautCard;
