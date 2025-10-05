import { Activity, Waves, Users, LayoutDashboard, BarChart2, Settings, User } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Waves className="w-8 h-8 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 bg-gradient-glow animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-quantum bg-clip-text text-transparent">
                Quantum Mood Tracker
              </h1>
              <p className="text-sm text-muted-foreground">ISS Mission Control • Real-time Analytics</p>
            </div>
          </div>
          
          {/* Enhanced Menu */}
          <nav className="flex items-center gap-4">
          </nav>

          <div className="flex items-center gap-6 ml-6">
            <div className="flex items-center gap-2 text-success">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">System Online</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5" />
              <span className="text-sm">6 Crew Members</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
