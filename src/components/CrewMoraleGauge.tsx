import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog"; // Assume you have a Dialog component

const CrewMoraleGauge = () => {
  const [morale, setMorale] = useState(78);
  const [showModal, setShowModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMorale(prev => {
        const change = (Math.random() - 0.5) * 3;
        setLastUpdated(new Date());
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
    <Card className="p-6 bg-gradient-space border-border relative overflow-hidden" aria-label="Crew Morale KPI">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground" tabIndex={0} aria-label="Collective Crew Morale">Collective Crew Morale</h3>
          <button
            className="text-xs px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary bg-primary/10 text-primary font-semibold"
            aria-label="Investigate KPI"
            onClick={() => setShowModal(true)}
          >
            Investigate
          </button>
        </div>
        <p className="text-base text-muted-foreground mb-2">Quantum-averaged emotional state</p>
        <div className="flex gap-4 items-center mb-2">
          <span className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <select className="text-xs bg-card border rounded px-2 py-1 focus:outline focus:ring-2 focus:ring-primary"
            aria-label="Select data window"
          >
            <option>24h</option>
            <option>7d</option>
            <option>30d</option>
          </select>
        </div>
        {/* KPI breakdown */}
        <div className="flex flex-wrap gap-4 mb-4" aria-label="KPI Breakdown">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-success">+{Math.round(morale * 0.4)}</span>
            <span className="text-sm text-foreground">Positive</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-primary">+{Math.round(morale * 0.3)}</span>
            <span className="text-sm text-foreground">Neutral</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-warning">-{Math.round(100 - morale)}</span>
            <span className="text-sm text-foreground">Uncertain</span>
          </div>
        </div>
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

        {/* Modal for calculation details */}
        {showModal && (
          <Dialog onClose={() => setShowModal(false)} aria-modal="true" aria-label="KPI Calculation Details">
            <div className="p-4">
              <h4 className="text-lg font-bold mb-2">Morale Calculation</h4>
              <p className="mb-2 text-base text-foreground">Morale is calculated as a weighted average of crew mood, biometric stability, and recent interventions over the selected data window. Confidence is based on data completeness and sensor reliability.</p>
              <ul className="mb-2 text-base">
                <li><b>Data window:</b> Selectable (default 24h)</li>
                <li><b>Confidence:</b> High (last sync: {lastUpdated.toLocaleTimeString()})</li>
              </ul>
              <button className="mt-2 px-3 py-1 rounded bg-primary text-card-foreground font-semibold"
                onClick={() => setShowModal(false)}
                autoFocus
              >Close</button>
              <button className="mt-2 ml-2 px-3 py-1 rounded bg-secondary text-card-foreground font-semibold"
                aria-label="Export KPI snapshot"
              >Export Snapshot</button>
            </div>
          </Dialog>
        )}
      </div>
    </Card>
  );
};

export default CrewMoraleGauge;
