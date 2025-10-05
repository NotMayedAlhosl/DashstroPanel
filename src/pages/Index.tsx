import Header from "@/components/Header";
import CrewMoraleGauge from "@/components/CrewMoraleGauge";
import AstronautCard from "@/components/AstronautCard";
import MoodTrendChart from "@/components/MoodTrendChart";
import AlertPanel from "@/components/AlertPanel";
import RecommendationPanel from "@/components/RecommendationPanel";
import QuantumVisualization from "@/components/QuantumVisualization";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const Index = () => {
  const astronauts = [
    {
      name: "Commander Chen",
      role: "Mission Commander",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen",
    },
    {
      name: "Dr. Rodriguez",
      role: "Chief Medical Officer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rodriguez",
    },
    {
      name: "Engineer Patel",
      role: "Systems Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=patel",
    },
    {
      name: "Lt. Kim",
      role: "Flight Engineer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kim",
    },
    {
      name: "Specialist Brown",
      role: "Science Specialist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brown",
    },
    {
      name: "Dr. Wilson",
      role: "Research Scientist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wilson",
    },
  ];

  const isMobile = useIsMobile();
  const [showTour, setShowTour] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-space" aria-label="Dashboard">
      <Header />
      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex justify-end mb-2">
          <button
            className="px-3 py-1 rounded bg-accent text-card-foreground font-semibold focus:outline focus:ring-2 focus:ring-accent"
            aria-label="Start onboarding tour"
            onClick={() => setShowTour(true)}
          >Take a Tour</button>
        </div>
        {/* Top row: Morale gauge and Quantum viz */}
        <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
          <CrewMoraleGauge />
          <QuantumVisualization />
        </div>
        {/* Astronaut cards */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4" tabIndex={0}>Crew Status Overview</h2>
          <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {astronauts.map(astronaut => (
              <AstronautCard key={astronaut.name} {...astronaut} />
            ))}
          </div>
        </div>
        {/* Charts and panels */}
        <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-1 lg:grid-cols-3 gap-6"}>
          <div className={isMobile ? "" : "lg:col-span-2"}>
            <MoodTrendChart />
          </div>
          <div>
            <AlertPanel />
          </div>
        </div>
        <RecommendationPanel />
        {/* Onboarding tour modal (stub) */}
        {showTour && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" aria-modal="true" aria-label="Onboarding Tour">
            <div className="bg-card p-8 rounded-lg max-w-lg text-foreground">
              <h3 className="text-xl font-bold mb-2">Welcome to Quantum Mood Tracker!</h3>
              <ul className="mb-4 text-base">
                <li>• KPI breakdowns show how morale is calculated.</li>
                <li>• Click “Investigate” for detailed analysis and export.</li>
                <li>• Crew cards offer quick actions and timelines.</li>
                <li>• Alerts are actionable and tracked in history.</li>
                <li>• Charts are interactive and exportable.</li>
                <li>• Use toggles for high-contrast and color-blind modes.</li>
              </ul>
              <button className="mt-2 px-3 py-1 rounded bg-primary text-card-foreground font-semibold"
                onClick={() => setShowTour(false)}
                autoFocus
              >Close Tour</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
