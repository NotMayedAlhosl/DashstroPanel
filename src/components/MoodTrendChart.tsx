import { useEffect, useState, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface DataPoint {
  time: string;
  mood: number;
  uncertainty: number;
}

const MoodTrendChart = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [showMood, setShowMood] = useState(true);
  const [showUncertainty, setShowUncertainty] = useState(true);
  const [smoothed, setSmoothed] = useState(true);

  useEffect(() => {
    // Initialize with some data
    const initialData: DataPoint[] = [];
    for (let i = 24; i >= 0; i--) {
      initialData.push({
        time: `${i}h`,
        mood: 50 + Math.random() * 30,
        uncertainty: 10 + Math.random() * 15,
      });
    }
    setData(initialData);

    // Update data periodically
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: '0h',
          mood: Math.max(30, Math.min(90, prev[prev.length - 1].mood + (Math.random() - 0.5) * 10)),
          uncertainty: Math.max(5, Math.min(25, prev[prev.length - 1].uncertainty + (Math.random() - 0.5) * 5)),
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Smoothed data (simple moving average)
  const getSmoothedData = (data: DataPoint[]) => {
    if (!smoothed) return data;
    return data.map((d, i, arr) => {
      const window = arr.slice(Math.max(0, i - 2), i + 1);
      return {
        ...d,
        mood: window.reduce((sum, w) => sum + w.mood, 0) / window.length,
        uncertainty: window.reduce((sum, w) => sum + w.uncertainty, 0) / window.length,
      };
    });
  };

  const chartData = getSmoothedData(data);

  return (
    <Card className="p-6 bg-gradient-space border-border" aria-label="Mood Trend Chart">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground" tabIndex={0}>24-Hour Mood Trend Analysis</h3>
          <p className="text-base text-muted-foreground">Quantum probability distribution over time</p>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-2 py-1 rounded ${showMood ? "bg-primary text-card-foreground" : "bg-card text-primary"} font-semibold`}
            onClick={() => setShowMood(v => !v)}
            aria-pressed={showMood}
          >Mood</button>
          <button
            className={`px-2 py-1 rounded ${showUncertainty ? "bg-secondary text-card-foreground" : "bg-card text-secondary"} font-semibold`}
            onClick={() => setShowUncertainty(v => !v)}
            aria-pressed={showUncertainty}
          >Uncertainty</button>
          <button
            className={`px-2 py-1 rounded ${smoothed ? "bg-success text-card-foreground" : "bg-card text-success"} font-semibold`}
            onClick={() => setSmoothed(v => !v)}
            aria-pressed={smoothed}
          >{smoothed ? "Smoothed" : "Raw"}</button>
        </div>
      </div>
      <Suspense fallback={<div className="text-center text-muted-foreground">Loading chart...</div>}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="uncertaintyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '16px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '16px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
                fontSize: '16px'
              }}
            />
            {showUncertainty && (
              <Area 
                type="monotone" 
                dataKey="uncertainty" 
                stroke="hsl(var(--secondary))" 
                fill="url(#uncertaintyGradient)"
                strokeWidth={2}
              />
            )}
            {showMood && (
              <Area 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--primary))" 
                fill="url(#moodGradient)"
                strokeWidth={3}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Suspense>
      {/* Interactive legend */}
      <div className="flex items-center justify-center gap-6 mt-4" aria-label="Chart Legend">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary shadow-glow-primary" />
          <span className="text-base text-foreground">Mood Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-secondary shadow-glow-secondary" />
          <span className="text-base text-foreground">Uncertainty Range</span>
        </div>
      </div>
      {/* Sparkline preview */}
      <div className="mt-4">
        <span className="text-xs text-muted-foreground">Preview:</span>
        <svg width="100" height="24" aria-label="Mood sparkline">
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            points={data.map((d, i) => `${i * 4},${24 - d.mood / 5}`).join(" ")}
          />
        </svg>
      </div>
      {/* Export button */}
      <button
        className="mt-4 px-3 py-1 rounded bg-primary text-card-foreground font-semibold focus:outline focus:ring-2 focus:ring-primary"
        aria-label="Export chart snapshot"
      >Export Snapshot</button>
    </Card>
  );
};

export default MoodTrendChart;
