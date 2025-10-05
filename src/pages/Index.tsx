import Header from "@/components/Header";
import CrewMoraleGauge from "@/components/CrewMoraleGauge";
import AstronautCard from "@/components/AstronautCard";
import MoodTrendChart from "@/components/MoodTrendChart";
import AlertPanel from "@/components/AlertPanel";
import RecommendationPanel from "@/components/RecommendationPanel";
import QuantumVisualization from "@/components/QuantumVisualization";

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

  return (
    <div className="min-h-screen bg-gradient-space">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Top row: Morale gauge and Quantum viz */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CrewMoraleGauge />
          <QuantumVisualization />
        </div>

        {/* Astronaut cards */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Crew Status Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {astronauts.map(astronaut => (
              <AstronautCard key={astronaut.name} {...astronaut} />
            ))}
          </div>
        </div>

        {/* Charts and panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MoodTrendChart />
          </div>
          <div>
            <AlertPanel />
          </div>
        </div>

        {/* Recommendations */}
        <RecommendationPanel />
      </main>
    </div>
  );
};

export default Index;
