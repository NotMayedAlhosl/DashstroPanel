import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Heart, MessageCircle, Flag, ClipboardList } from "lucide-react";
import { Dialog } from "@/components/ui/dialog"; // For modals

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
  const [showTimeline, setShowTimeline] = useState(false);
  const [showIntervention, setShowIntervention] = useState(false);
  const [showSentiment, setShowSentiment] = useState(false);
  const [sentiments, setSentiments] = useState<string[]>([]);
  const [sentimentInput, setSentimentInput] = useState("");
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [warningThreshold, setWarningThreshold] = useState(40);
  const [stressThreshold, setStressThreshold] = useState(60);

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

  // Simulate risk prediction
  const predictRisk = () => {
    // Dummy logic for demo
    return [
      { hours: 4, risk: Math.random() * 0.3, confidence: 0.8 + Math.random() * 0.2 },
      { hours: 8, risk: Math.random() * 0.5, confidence: 0.7 + Math.random() * 0.3 },
      { hours: 24, risk: Math.random() * 0.7, confidence: 0.6 + Math.random() * 0.4 },
    ];
  };
  const riskIndex = predictRisk();

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

      <div className="mt-2 flex gap-2">
        {/* Future Mood Risk Index */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-semibold">Future Mood Risk Index</span>
          <div className="flex gap-2">
            {riskIndex.map(risk => (
              <div key={risk.hours} className="flex flex-col items-center">
                <span className="text-xs">{risk.hours}h</span>
                <span className="text-sm font-bold text-warning">{(risk.risk * 100).toFixed(0)}%</span>
                <span className="text-[10px] text-muted-foreground">Conf: {(risk.confidence * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
        {/* Threshold adjust (authorized only, demo: always visible) */}
        <button
          className="ml-auto px-2 py-1 rounded bg-muted/10 text-muted-foreground text-xs"
          aria-label="Adjust thresholds"
          onClick={() => setShowThresholdModal(true)}
        >Adjust Thresholds</button>
      </div>

      {/* Sentiment tags */}
      <div className="mt-2 flex flex-wrap gap-1">
        {sentiments.map((tag, i) => (
          <span key={i} className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs">#{tag}</span>
        ))}
        <button
          className="ml-2 px-2 py-0.5 rounded bg-accent/10 text-accent text-xs"
          onClick={() => setShowSentiment(true)}
        >Log Sentiment</button>
      </div>

      <div className="flex gap-2 mt-4">
        {/* Intervention Action Portal */}
        <button
          className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold focus:outline focus:ring-2 focus:ring-primary"
          aria-label={`Open Intervention Portal for ${name}`}
          onClick={() => setShowIntervention(true)}
        >
          Intervention Portal
        </button>
        <button
          className="px-2 py-1 rounded bg-success/10 text-success font-semibold focus:outline focus:ring-2 focus:ring-success"
          aria-label={`Assign task to ${name}`}
        >
          <ClipboardList className="w-4 h-4 inline" /> Assign
        </button>
        {/* Timeline button unchanged */}
        <button
          className="ml-auto px-2 py-1 rounded bg-secondary/10 text-secondary font-semibold focus:outline focus:ring-2 focus:ring-secondary"
          aria-label={`Show timeline for ${name}`}
          onClick={() => setShowTimeline(v => !v)}
        >
          Timeline
        </button>
      </div>
      {showTimeline && (
        <div className="mt-4 bg-card/90 rounded p-2 border border-border">
          <h4 className="text-base font-bold mb-2 text-foreground">24h Timeline</h4>
          <ul className="text-sm text-muted-foreground">
            <li>08:00 - Mood assessment: Stable</li>
            <li>10:30 - Intervention: Meditation</li>
            <li>13:00 - Alert: Fatigue detected</li>
            <li>15:00 - Message: Family call</li>
            <li>18:00 - Task assigned: System check</li>
            {/* ...could be dynamic... */}
          </ul>
        </div>
      )}
      {/* Intervention Action Portal Modal */}
      {showIntervention && (
        <Dialog onClose={() => setShowIntervention(false)} aria-modal="true" aria-label="Intervention Action Portal">
          <div className="p-4">
            <h4 className="text-lg font-bold mb-2">Intervention Playbooks</h4>
            <ul className="mb-2 text-base">
              <li>• Role: {role}</li>
              <li>• Suggested: {role === "Chief Medical Officer" ? "Check rest log" : "Schedule group activity"}</li>
              <li>• Outcome: <span className="text-muted-foreground">Pending</span></li>
            </ul>
            <button className="mt-2 px-3 py-1 rounded bg-primary text-card-foreground font-semibold"
              onClick={() => setShowIntervention(false)}
              autoFocus
            >Close</button>
          </div>
        </Dialog>
      )}
      {/* Sentiment Check Modal */}
      {showSentiment && (
        <Dialog onClose={() => setShowSentiment(false)} aria-modal="true" aria-label="Log Sentiment">
          <div className="p-4">
            <h4 className="text-lg font-bold mb-2">Log Sentiment</h4>
            <input
              className="border rounded px-2 py-1 w-full mb-2"
              placeholder="Enter tag (e.g. Tired, Excited)"
              value={sentimentInput}
              onChange={e => setSentimentInput(e.target.value)}
              autoFocus
            />
            <button
              className="px-3 py-1 rounded bg-accent text-card-foreground font-semibold"
              onClick={() => {
                if (sentimentInput.trim()) {
                  setSentiments([...sentiments, sentimentInput.trim()]);
                  setSentimentInput("");
                  setShowSentiment(false);
                }
              }}
            >Submit</button>
          </div>
        </Dialog>
      )}
      {/* Threshold Adjustment Modal */}
      {showThresholdModal && (
        <Dialog onClose={() => setShowThresholdModal(false)} aria-modal="true" aria-label="Adjust Thresholds">
          <div className="p-4">
            <h4 className="text-lg font-bold mb-2">Adjust Warning/Stress Thresholds</h4>
            <label className="block mb-2 text-base">
              Warning Threshold:
              <input
                type="number"
                min={0}
                max={100}
                value={warningThreshold}
                onChange={e => setWarningThreshold(Number(e.target.value))}
                className="ml-2 border rounded px-2 py-1"
              />
            </label>
            <label className="block mb-2 text-base">
              Stress Threshold:
              <input
                type="number"
                min={0}
                max={100}
                value={stressThreshold}
                onChange={e => setStressThreshold(Number(e.target.value))}
                className="ml-2 border rounded px-2 py-1"
              />
            </label>
            <button className="mt-2 px-3 py-1 rounded bg-primary text-card-foreground font-semibold"
              onClick={() => setShowThresholdModal(false)}
              autoFocus
            >Save</button>
          </div>
        </Dialog>
      )}
    </Card>
  );
};

export default AstronautCard;
