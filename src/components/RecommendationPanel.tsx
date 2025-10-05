import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles } from "lucide-react";

interface Recommendation {
  id: string;
  astronaut: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const RecommendationPanel = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const astronauts = ["Commander Chen", "Dr. Rodriguez", "Engineer Patel", "Lt. Kim", "Specialist Brown", "Dr. Wilson"];
    const recs = [
      {
        title: "Meditation Session Recommended",
        description: "30-minute mindfulness exercise to reduce cortisol levels",
        priority: "high" as const,
      },
      {
        title: "Social Interaction Time",
        description: "Schedule group activity to boost collective morale",
        priority: "medium" as const,
      },
      {
        title: "Sleep Optimization",
        description: "Adjust cabin lighting 2 hours before rest period",
        priority: "high" as const,
      },
      {
        title: "Physical Exercise",
        description: "Light resistance training to improve mood indicators",
        priority: "medium" as const,
      },
      {
        title: "Communication with Earth",
        description: "Video call with family to enhance emotional wellbeing",
        priority: "low" as const,
      },
    ];

    const initialRecommendations = recs.slice(0, 3).map((rec, i) => ({
      id: `rec-${i}`,
      astronaut: astronauts[Math.floor(Math.random() * astronauts.length)],
      ...rec,
    }));

    setRecommendations(initialRecommendations);

    const interval = setInterval(() => {
      const newRec = {
        id: `rec-${Date.now()}`,
        astronaut: astronauts[Math.floor(Math.random() * astronauts.length)],
        ...recs[Math.floor(Math.random() * recs.length)],
      };
      setRecommendations(prev => [newRec, ...prev.slice(0, 2)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive";
      case "medium": return "bg-warning";
      default: return "bg-primary";
    }
  };

  return (
    <Card className="p-6 bg-gradient-space border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/20 rounded-lg">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
          <p className="text-sm text-muted-foreground">Quantum-enhanced wellness suggestions</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map(rec => (
          <div 
            key={rec.id}
            className="p-4 rounded-lg bg-card/50 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-glow-secondary group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-full mt-1 group-hover:bg-accent/20 transition-colors">
                <Lightbulb className="w-4 h-4 text-accent" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-foreground">{rec.title}</h4>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)} animate-pulse-glow`} />
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {rec.astronaut}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {rec.priority} priority
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendationPanel;
