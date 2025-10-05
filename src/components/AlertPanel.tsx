import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Alert {
  id: string;
  type: "warning" | "info" | "success";
  astronaut: string;
  message: string;
  timestamp: Date;
  owner?: string;
  severity?: "low" | "medium" | "high";
  history?: Array<{ action: string; time: Date }>;
}

const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);
  const actionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const astronauts = ["Commander Chen", "Dr. Rodriguez", "Engineer Patel", "Lt. Kim", "Specialist Brown", "Dr. Wilson"];
    const messages = {
      warning: [
        "Elevated stress levels detected",
        "Fatigue indicators rising",
        "Heart rate variability increased",
        "Sleep quality declining",
      ],
      info: [
        "Routine biometric scan complete",
        "Mood assessment updated",
        "Quantum analysis in progress",
      ],
      success: [
        "Stress levels normalizing",
        "Recovery phase detected",
        "Optimal mood state achieved",
      ],
    };

    // Generate initial alerts
    const initialAlerts: Alert[] = [];
    for (let i = 0; i < 3; i++) {
      const type = Math.random() > 0.7 ? "warning" : Math.random() > 0.5 ? "info" : "success";
      initialAlerts.push({
        id: `alert-${Date.now()}-${i}`,
        type,
        astronaut: astronauts[Math.floor(Math.random() * astronauts.length)],
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        timestamp: new Date(Date.now() - Math.random() * 3600000),
      });
    }
    setAlerts(initialAlerts);

    // Add new alerts periodically
    const interval = setInterval(() => {
      const type = Math.random() > 0.6 ? "warning" : Math.random() > 0.4 ? "info" : "success";
      const newAlert: Alert = {
        id: `alert-${Date.now()}`,
        type,
        astronaut: astronauts[Math.floor(Math.random() * astronauts.length)],
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        timestamp: new Date(),
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "success": return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "warning": return "border-warning/30 bg-warning/10";
      case "success": return "border-success/30 bg-success/10";
      default: return "border-primary/30 bg-primary/10";
    }
  };

  const handleAction = (alertId: string, action: string) => {
    setAlertHistory(prev => [
      ...prev,
      { ...alerts.find(a => a.id === alertId)!, history: [{ action, time: new Date() }] },
    ]);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Simulate mission context and baseline
  const getAlertContext = (alert: Alert) => {
    if (alert.astronaut === "Dr. Wilson" && alert.type === "warning") {
      return "Dr. Wilson's stress is 12% higher than his personal baseline during a critical-phase maneuver.";
    }
    return null;
  };
  // Simulate root cause suggestions
  const getRootCauseSuggestions = (alert: Alert) => {
    if (alert.astronaut === "Dr. Rodriguez") {
      return ["Medics check rest period log", "Review biometric scan"];
    }
    if (alert.type === "warning") {
      return ["Schedule group activity", "Assign meditation session"];
    }
    return ["Monitor status"];
  };

  return (
    <Card className="p-6 bg-gradient-space border-border" aria-label="Alert Panel">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground" tabIndex={0}>Real-time Alerts</h3>
        <p className="text-base text-muted-foreground">AI-powered monitoring system</p>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto" aria-live="polite">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg border ${getAlertColor(alert.type)} transition-all duration-300 hover:scale-[1.02] focus:outline focus:ring-2 focus:ring-warning`}
            tabIndex={0}
            aria-label={`Alert: ${alert.message} for ${alert.astronaut}`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${
                alert.type === "warning" ? "text-warning" : 
                alert.type === "success" ? "text-success" : 
                "text-primary"
              }`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{alert.astronaut}</span>
                  <Badge variant="outline" className="text-xs">{alert.type}</Badge>
                  <Badge variant="outline" className="text-xs capitalize">{alert.severity || "medium"}</Badge>
                  <span className="text-xs text-muted-foreground ml-2">Owner: {alert.owner || "Unassigned"}</span>
                </div>
                <p className="text-base text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {alert.timestamp.toLocaleTimeString()}
                </p>
                {/* Mission context */}
                {getAlertContext(alert) && (
                  <p className="text-xs text-warning mt-1">{getAlertContext(alert)}</p>
                )}
                {/* Root Cause Suggestion Matrix */}
                <div className="mt-2">
                  <span className="text-xs font-semibold text-accent">Root Cause Suggestions:</span>
                  <ul className="text-xs text-muted-foreground ml-2">
                    {getRootCauseSuggestions(alert).map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-2 py-1 rounded bg-success/10 text-success font-semibold focus:outline focus:ring-2 focus:ring-success"
                    aria-label="Acknowledge alert"
                    onClick={() => handleAction(alert.id, "acknowledged")}
                  >Acknowledge</button>
                  <button
                    className="px-2 py-1 rounded bg-primary/10 text-primary font-semibold focus:outline focus:ring-2 focus:ring-primary"
                    aria-label="Assign alert"
                    onClick={() => handleAction(alert.id, "assigned")}
                  >Assign</button>
                  <button
                    className="px-2 py-1 rounded bg-warning/10 text-warning font-semibold focus:outline focus:ring-2 focus:ring-warning"
                    aria-label="Snooze alert"
                    onClick={() => handleAction(alert.id, "snoozed")}
                  >Snooze</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Alert history */}
      <div className="mt-6">
        <h4 className="text-base font-bold text-foreground mb-2">Alert History</h4>
        <div className="max-h-[120px] overflow-y-auto">
          {alertHistory.map((alert, idx) => (
            <div key={idx} className="text-xs text-muted-foreground mb-1">
              [{alert.history?.[0].time.toLocaleTimeString()}] {alert.astronaut}: {alert.message} ({alert.history?.[0].action})
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AlertPanel;
