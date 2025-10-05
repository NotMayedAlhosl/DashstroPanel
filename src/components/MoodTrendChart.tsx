import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface DataPoint {
  time: string;
  mood: number;
  uncertainty: number;
}

const MoodTrendChart = () => {
  const [data, setData] = useState<DataPoint[]>([]);

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

  return (
    <Card className="p-6 bg-gradient-space border-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">24-Hour Mood Trend Analysis</h3>
        <p className="text-sm text-muted-foreground">Quantum probability distribution over time</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
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
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="uncertainty" 
            stroke="hsl(var(--secondary))" 
            fill="url(#uncertaintyGradient)"
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="mood" 
            stroke="hsl(var(--primary))" 
            fill="url(#moodGradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary shadow-glow-primary" />
          <span className="text-sm text-muted-foreground">Mood Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary shadow-glow-secondary" />
          <span className="text-sm text-muted-foreground">Uncertainty Range</span>
        </div>
      </div>
    </Card>
  );
};

export default MoodTrendChart;
