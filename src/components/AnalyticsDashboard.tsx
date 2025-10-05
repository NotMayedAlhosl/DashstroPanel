import { Card } from "@/components/ui/card";

const AnalyticsDashboard = () => {
  // Simulate analytics data
  const cohesionScore = 82;
  const missionImpact = [
    { phase: "Prep", stress: 40 },
    { phase: "Critical", stress: 68 },
    { phase: "Recovery", stress: 55 },
  ];

  return (
    <Card className="p-6 bg-gradient-space border-border mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Dashboard</h3>
      <p className="text-base text-muted-foreground mb-4">Longitudinal reports on team cohesion and mission phase impact</p>
      <div className="mb-4">
        <span className="font-bold text-success">Team Cohesion Score:</span>
        <span className="ml-2 text-lg font-bold">{cohesionScore}%</span>
      </div>
      <div>
        <span className="font-bold text-secondary">Mission Phase Stress Impact:</span>
        <ul className="ml-4 mt-2">
          {missionImpact.map((m, i) => (
            <li key={i} className="text-base text-muted-foreground">
              {m.phase}: <span className="font-bold text-warning">{m.stress}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default AnalyticsDashboard;
