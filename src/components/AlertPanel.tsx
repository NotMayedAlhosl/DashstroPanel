import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface Alert {
  id: string;
  type: "warning" | "info" | "success";
  astronaut: string;
  message: string;
  timestamp: Date;
}

const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

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

  return (
    <Card className="p-6 bg-gradient-space border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Real-time Alerts</h3>
        <p className="text-sm text-muted-foreground">AI-powered monitoring system</p>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`p-4 rounded-lg border ${getAlertColor(alert.type)} transition-all duration-300 hover:scale-[1.02]`}
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
                  <Badge variant="outline" className="text-xs">
                    {alert.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AlertPanel;
