import { useEffect, useState, Suspense, useRef } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Dialog } from "@/components/ui/dialog";

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
  const [compareCrew, setCompareCrew] = useState<string | null>(null);
  const [compareData, setCompareData] = useState<DataPoint[] | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "csv" | "json" | null>(null);
  const [timeRange, setTimeRange] = useState("24h");
  const [missionName, setMissionName] = useState("ISS Quantum Mission");
  const [userRole, setUserRole] = useState("Commander");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const chartRef = useRef(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with some data
    const labels = generateTimeLabels(timeRange as "24h" | "12h");
    const initialData: DataPoint[] = labels.map((label, idx) => ({
      time: label,
      mood: 50 + Math.random() * 30,
      uncertainty: 10 + Math.random() * 15,
    }));
    setData(initialData);
    setLastUpdated(new Date());

    // Update data periodically
    const interval = setInterval(() => {
      setData(prev => {
        const labels = generateTimeLabels(timeRange as "24h" | "12h");
        let newData = [...prev];
        // Remove oldest, add newest
        newData = newData.slice(1);
        newData.push({
          time: labels[labels.length - 1],
          mood: Math.max(30, Math.min(90, prev[prev.length - 1].mood + (Math.random() - 0.5) * 10)),
          uncertainty: Math.max(5, Math.min(25, prev[prev.length - 1].uncertainty + (Math.random() - 0.5) * 5)),
        });
        setLastUpdated(new Date());
        // Update time labels for all points
        return newData.map((d, i) => ({ ...d, time: labels[i] }));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [timeRange]);

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

  // Simulate comparison data
  useEffect(() => {
    if (compareCrew) {
      const comp: DataPoint[] = [];
      for (let i = 24; i >= 0; i--) {
        comp.push({
          time: `${i}h`,
          mood: 60 + Math.random() * 20,
          uncertainty: 12 + Math.random() * 10,
        });
      }
      setCompareData(comp);
    } else {
      setCompareData(null);
    }
  }, [compareCrew]);

  // Simulate overlayed alerts/events
  const overlayEvents = [
    { time: "8h", type: "alert", label: "Fatigue detected" },
    { time: "15h", type: "event", label: "Critical-phase maneuver" },
  ];

  // Custom tooltip for interactivity
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const event = overlayEvents.find(e => e.time === label);
      return (
        <div className="p-2 rounded bg-card border border-border text-foreground text-xs">
          <div>Time: {label}</div>
          <div>Mood: {payload[0].value?.toFixed(1)}</div>
          <div>Uncertainty: {payload[1]?.value?.toFixed(1)}</div>
          {event && <div className="text-warning">{event.label}</div>}
        </div>
      );
    }
    return null;
  };

  // Helper to generate time labels for the selected range
  const generateTimeLabels = (range: "24h" | "12h") => {
    const step = range === "24h" ? 1 : 1;
    const hours = range === "24h" ? 24 : 12;
    const now = new Date();
    const labels: string[] = [];
    for (let i = hours; i >= 0; i -= step) {
      // Option 1: Use hour offset (e.g., "0h", "2h", ...)
      labels.push(`${i}h`);
      // Option 2: Use actual time stamps (uncomment below for real time)
      // const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      // labels.push(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return labels;
  };

  // Filter data by time range (simulate)
  const getFilteredData = () => {
    if (timeRange === "24h") return data;
    if (timeRange === "12h") return data.slice(-13); // 12h + 0h
    if (timeRange === "7d") return data; // For demo, just return all
    return data;
  };

  // PDF Generation
  const handleExportPDF = async () => {
    setShowExportModal(false);
    const doc = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
    const timestamp = new Date().toLocaleString();

    // Dashboard snapshot
    if (chartContainerRef.current) {
      const canvas = await html2canvas(chartContainerRef.current, { backgroundColor: "#111" });
      const imgData = canvas.toDataURL("image/png");
      doc.setFontSize(22);
      doc.text("Mission Readiness Report", 40, 40);
      doc.setFontSize(14);
      doc.text(`Mission: ${missionName}`, 40, 70);
      doc.text(`Generated: ${timestamp}`, 40, 90);
      doc.text(`User Role: ${userRole}`, 40, 110);
      doc.text(`Time Range: ${timeRange}`, 40, 130);
      doc.text("Mission-Level Readiness KPI: 81% Optimal", 40, 160);
      doc.addImage(imgData, "PNG", 40, 180, 600, 180);

      // Alerts and Recommendations (simulate, replace with real props if needed)
      doc.setFontSize(16);
      doc.text("Active Real-Time Alerts:", 40, 380);
      doc.setFontSize(12);
      doc.text("- Fatigue detected (Remediation: Schedule group activity)", 60, 400);
      doc.text("- Heart rate variability increased (Remediation: Assign meditation session)", 60, 415);

      doc.setFontSize(16);
      doc.text("AI Recommendations:", 40, 440);
      doc.setFontSize(12);
      doc.text("- Meditation Session Recommended: 30-minute mindfulness exercise", 60, 460);
      doc.text("- Sleep Optimization: Adjust cabin lighting", 60, 475);

      doc.save(`MissionReadinessReport_${timestamp.replace(/[: ]/g, "_")}.pdf`);
    }
  };

  // Raw Data Export
  const handleExportRaw = (format: "csv" | "json") => {
    setShowExportModal(false);
    const filtered = getFilteredData();
    if (format === "json") {
      const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MissionRawData_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV
      const header = Object.keys(filtered[0]).join(",");
      const rows = filtered.map(d => Object.values(d).join(",")).join("\n");
      const csv = header + "\n" + rows;
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `MissionRawData_${new Date().toISOString()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className="p-6 bg-gradient-space border-border" aria-label="Mood Trend Chart">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground" tabIndex={0}>24-Hour Mood Trend Analysis</h3>
          <p className="text-base text-muted-foreground">Quantum probability distribution over time</p>
          <span className="block mt-1 text-base font-bold text-accent bg-card/80 px-2 py-1 rounded">
            Last Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
        {/* Time range buttons */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded font-semibold border-2 ${timeRange === "24h" ? "bg-primary text-card-foreground border-primary" : "bg-card text-primary border-primary/50"}`}
            onClick={() => setTimeRange("24h")}
            aria-pressed={timeRange === "24h"}
          >24h</button>
          <button
            className={`px-3 py-1 rounded font-semibold border-2 ${timeRange === "12h" ? "bg-secondary text-card-foreground border-secondary" : "bg-card text-secondary border-secondary/50"}`}
            onClick={() => setTimeRange("12h")}
            aria-pressed={timeRange === "12h"}
          >12h Real-time</button>
        </div>
      </div>
      <Suspense fallback={<div className="text-center text-muted-foreground">Loading chart...</div>}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={getFilteredData()} ref={chartRef}>
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
            {/* Overlay mission events/alerts */}
            {overlayEvents.map((e, i) => (
              <Line
                key={i}
                type="step"
                dataKey="mood"
                stroke={e.type === "alert" ? "hsl(var(--destructive))" : "hsl(var(--secondary))"}
                strokeDasharray="4 2"
                dot={false}
                data={[{ time: e.time, mood: 0 }]}
              />
            ))}
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '16px' }}
              interval={0}
              tick={{ fontSize: 14 }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '16px' }}
            />
            <Tooltip content={<CustomTooltip />} />
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
            {/* Comparison line */}
            {compareData && (
              <Line
                type="monotone"
                dataKey="mood"
                data={compareData}
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Suspense>
      {/* Comparison selector */}
      <div className="mt-2 flex gap-2">
        <span className="text-xs text-muted-foreground">Compare:</span>
        <select
          className="text-xs bg-card border rounded px-2 py-1"
          value={compareCrew || ""}
          onChange={e => setCompareCrew(e.target.value || null)}
        >
          <option value="">Team Average</option>
          <option value="Commander Chen">Commander Chen</option>
          <option value="Dr. Rodriguez">Dr. Rodriguez</option>
          <option value="Engineer Patel">Engineer Patel</option>
          <option value="Lt. Kim">Lt. Kim</option>
          <option value="Specialist Brown">Specialist Brown</option>
          <option value="Dr. Wilson">Dr. Wilson</option>
        </select>
      </div>
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
      <div ref={chartContainerRef}>
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
      </div>
      {/* Export buttons */}
      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 rounded bg-primary text-card-foreground font-semibold focus:outline focus:ring-2 focus:ring-primary"
          aria-label="Generate Mission Readiness PDF Report"
          onClick={() => { setExportType("pdf"); setShowExportModal(true); }}
        >Generate Mission Readiness Report (PDF)</button>
        <button
          className="px-3 py-1 rounded bg-secondary text-card-foreground font-semibold focus:outline focus:ring-2 focus:ring-secondary"
          aria-label="Export Raw Data"
          onClick={() => { setExportType("csv"); setShowExportModal(true); }}
        >Export Raw Data (CSV)</button>
        <button
          className="px-3 py-1 rounded bg-accent text-card-foreground font-semibold focus:outline focus:ring-2 focus:ring-accent"
          aria-label="Export Raw Data JSON"
          onClick={() => { setExportType("json"); setShowExportModal(true); }}
        >Export Raw Data (JSON)</button>
      </div>
      {/* Export Modal */}
      {showExportModal && (
        <Dialog onClose={() => setShowExportModal(false)} aria-modal="true" aria-label="Export Options">
          <div className="p-4">
            <h4 className="text-lg font-bold mb-2">Export Options</h4>
            <label className="block mb-2 text-base">
              Mission Name:
              <input
                type="text"
                value={missionName}
                onChange={e => setMissionName(e.target.value)}
                className="ml-2 border rounded px-2 py-1 export-modal-input"
                placeholder="Enter mission name"
              />
            </label>
            <label className="block mb-2 text-base">
              User Role:
              <input
                type="text"
                value={userRole}
                onChange={e => setUserRole(e.target.value)}
                className="ml-2 border rounded px-2 py-1 export-modal-input"
                placeholder="Enter your role"
              />
            </label>
            <label className="block mb-2 text-base">
              Time Range:
              <select
                value={timeRange}
                onChange={e => setTimeRange(e.target.value)}
                className="ml-2 border rounded px-2 py-1 export-modal-select"
              >
                <option value="12h">Last 12 hours</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
              </select>
            </label>
            {exportType === "pdf" && (
              <button
                className="mt-2 px-3 py-1 rounded bg-primary text-card-foreground font-semibold"
                onClick={handleExportPDF}
                autoFocus
              >Generate PDF Report</button>
            )}
            {exportType === "csv" && (
              <button
                className="mt-2 px-3 py-1 rounded bg-secondary text-card-foreground font-semibold"
                onClick={() => handleExportRaw("csv")}
                autoFocus
              >Export CSV</button>
            )}
            {exportType === "json" && (
              <button
                className="mt-2 px-3 py-1 rounded bg-accent text-card-foreground font-semibold"
                onClick={() => handleExportRaw("json")}
                autoFocus
              >Export JSON</button>
            )}
            <button
              className="mt-2 ml-2 px-3 py-1 rounded bg-muted text-card-foreground font-semibold"
              onClick={() => setShowExportModal(false)}
            >Cancel</button>
          </div>
          <style>{`
            .export-modal-input::placeholder,
            .export-modal-select::placeholder {
              color: #000 !important;
              opacity: 1;
            }
            .export-modal-input,
            .export-modal-select {
              color: #000 !important;
              background: #fff !important;
            }
          `}</style>
        </Dialog>
      )}
    </Card>
  );
};

export default MoodTrendChart;
