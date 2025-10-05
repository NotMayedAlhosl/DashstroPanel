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
            <a
              href="/"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-foreground font-medium"
            >
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <span className="hidden sm:inline">Dashboard</span>
            </a>
            <a
              href="#crew"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-success/10 transition-colors text-foreground font-medium"
            >
              <User className="w-5 h-5 text-success" />
              <span className="hidden sm:inline">Crew</span>
            </a>
            <a
              href="#analytics"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-secondary/10 transition-colors text-foreground font-medium"
            >
              <BarChart2 className="w-5 h-5 text-secondary" />
              <span className="hidden sm:inline">Analytics</span>
            </a>
            <a
              href="#settings"
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-muted/10 transition-colors text-foreground font-medium"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="hidden sm:inline">Settings</span>
            </a>
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
