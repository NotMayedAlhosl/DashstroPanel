import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog"; // Assume you have a Dialog component
import html2canvas from "html2canvas"; // Add this import

const CrewMoraleGauge = () => {
  const [morale, setMorale] = useState(78);
  const [showModal, setShowModal] = useState(false);
  const [showExportChoice, setShowExportChoice] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "csv" | null>(null);
  const [missionName, setMissionName] = useState("ISS Quantum Mission");
  const [userRole, setUserRole] = useState("Commander");
  const [timeRange, setTimeRange] = useState("24h");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorale(prev => {
        const change = (Math.random() - 0.5) * 3;
        setLastUpdated(new Date());
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getMoraleColor = (value: number) => {
    if (value >= 70) return "text-success";
    if (value >= 40) return "text-warning";
    return "text-destructive";
  };

  const getMoraleStatus = (value: number) => {
    if (value >= 70) return "Optimal";
    if (value >= 40) return "Moderate";
    return "Critical";
  };

  // Simulate mission-level readiness KPI
  const missionReadiness = morale * 0.8 + Math.random() * 10;
  // Simulate team risk index
  const teamRiskIndex = [
    { hours: 4, risk: Math.random() * 0.2, confidence: 0.85 },
    { hours: 8, risk: Math.random() * 0.35, confidence: 0.8 },
    { hours: 24, risk: Math.random() * 0.5, confidence: 0.75 },
  ];

  // Export image snapshot of modal and gauge
  const handleExportImage = async () => {
    setShowExportChoice(false);
    if (modalRef.current) {
      const canvas = await html2canvas(modalRef.current, { backgroundColor: "#111", scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = `CrewMoraleSnapshot_${new Date().toISOString()}.png`;
      a.click();
    }
  };

  // Export full report (launch reporting modal)
  const handleExportReport = () => {
    setShowExportChoice(false);
    setShowReportModal(true);
  };

  // PDF/CSV export logic (reuse from MoodTrendChart, simplified for demo)
  const handleExportPDF = async () => {
    setShowReportModal(false);
    // ...insert PDF export logic here or call shared function...
    // For demo, just close modal
  };
  const handleExportCSV = () => {
    setShowReportModal(false);
    // ...insert CSV export logic here or call shared function...
    // For demo, just close modal
  };

  return (
    <Card className="p-6 bg-gradient-space border-border relative overflow-hidden" aria-label="Crew Morale KPI">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      <div className="relative z-10" ref={modalRef}>
        {/* Mission-Level Readiness KPI */}
        <div className="mb-2 flex items-center gap-4">
          <span className="text-base font-bold text-secondary">Mission Readiness KPI:</span>
          <span className="text-lg font-bold text-success">{missionReadiness.toFixed(1)}%</span>
        </div>
        {/* Team Future Mood Risk Index */}
        <div className="mb-2 flex gap-2">
          <span className="text-xs text-muted-foreground font-semibold">Team Risk Index:</span>
          {teamRiskIndex.map(risk => (
            <span key={risk.hours} className="text-xs text-warning">
              {risk.hours}h: {(risk.risk * 100).toFixed(0)}% (Conf: {(risk.confidence * 100).toFixed(0)}%)
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground" tabIndex={0} aria-label="Collective Crew Morale">Collective Crew Morale</h3>
          <button
            className="text-xs px-2 py-1 rounded focus:outline focus:ring-2 focus:ring-primary bg-primary/10 text-primary font-semibold"
            aria-label="Investigate KPI"
            onClick={() => setShowModal(true)}
          >
            Investigate
          </button>
        </div>
        <p className="text-base text-muted-foreground mb-2">Quantum-averaged emotional state</p>
        <div className="flex gap-4 items-center mb-2">
          <span className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <select className="text-xs bg-card border rounded px-2 py-1 focus:outline focus:ring-2 focus:ring-primary"
            aria-label="Select data window"
          >
            <option>24h</option>
            <option>7d</option>
            <option>30d</option>
          </select>
        </div>
        {/* KPI breakdown */}
        <div className="flex flex-wrap gap-4 mb-4" aria-label="KPI Breakdown">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-success">+{Math.round(morale * 0.4)}</span>
            <span className="text-sm text-foreground">Positive</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-primary">+{Math.round(morale * 0.3)}</span>
            <span className="text-sm text-foreground">Neutral</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-warning">-{Math.round(100 - morale)}</span>
            <span className="text-sm text-foreground">Uncertain</span>
          </div>
        </div>
        <div className="relative">
          <svg viewBox="0 0 200 120" className="w-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            
            {/* Foreground arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={morale >= 70 ? "hsl(var(--success))" : morale >= 40 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(morale / 100) * 251.2} 251.2`}
              className="transition-all duration-1000 drop-shadow-[0_0_8px_currentColor]"
            />
            
            {/* Center text */}
            <text x="100" y="85" textAnchor="middle" className="text-4xl font-bold fill-foreground">
              {Math.round(morale)}%
            </text>
            <text x="100" y="105" textAnchor="middle" className={`text-sm font-medium ${getMoraleColor(morale)}`}>
              {getMoraleStatus(morale)}
            </text>
          </svg>
        </div>

        {/* Modal for calculation details */}
        {showModal && (
          <Dialog onClose={() => setShowModal(false)} aria-modal="true" aria-label="KPI Calculation Details">
            <div className="p-4" ref={modalRef}>
              <h4 className="text-lg font-bold mb-2">Morale Calculation</h4>
              <p className="mb-2 text-base text-foreground">Morale is calculated as a weighted average of crew mood, biometric stability, and recent interventions over the selected data window. Confidence is based on data completeness and sensor reliability.</p>
              <ul className="mb-2 text-base">
                <li><b>Data window:</b> Selectable (default 24h)</li>
                <li><b>Confidence:</b> High (last sync: {lastUpdated.toLocaleTimeString()})</li>
              </ul>
              <button className="mt-2 px-3 py-1 rounded bg-primary text-card-foreground font-semibold"
                onClick={() => setShowExportChoice(true)}
                autoFocus
              >Export Snapshot</button>
              <button className="mt-2 ml-2 px-3 py-1 rounded bg-secondary text-card-foreground font-semibold"
                onClick={() => setShowModal(false)}
              >Close</button>
            </div>
          </Dialog>
        )}
        {/* Export Choice Modal */}
        {showExportChoice && (
          <Dialog onClose={() => setShowExportChoice(false)} aria-modal="true" aria-label="Export Options">
            <div className="p-4">
              <h4 className="text-lg font-bold mb-2">Export Options</h4>
              <button
                className="mt-2 px-3 py-1 rounded bg-success text-card-foreground font-semibold"
                onClick={handleExportImage}
                autoFocus
              >Export Simple Image Snapshot</button>
              <button
                className="mt-2 ml-2 px-3 py-1 rounded bg-primary text-card-foreground font-semibold"
                onClick={handleExportReport}
              >Generate Full Mission Readiness Report (PDF/CSV)</button>
              <button
                className="mt-2 ml-2 px-3 py-1 rounded bg-muted text-card-foreground font-semibold"
                onClick={() => setShowExportChoice(false)}
              >Cancel</button>
              {/* Update input/select styles for white background and black text/placeholder */}
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
            </div>
          </Dialog>
        )}
        {/* Reporting Modal (advanced) */}
        {showReportModal && (
          <Dialog onClose={() => setShowReportModal(false)} aria-modal="true" aria-label="Report Export">
            <div className="p-4">
              <h4 className="text-lg font-bold mb-2">Mission Readiness Report</h4>
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
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                </select>
              </label>
              <button
                className="mt-2 px-3 py-1 rounded bg-primary text-card-foreground font-semibold"
                onClick={handleExportPDF}
                autoFocus
              >Export PDF</button>
              <button
                className="mt-2 ml-2 px-3 py-1 rounded bg-secondary text-card-foreground font-semibold"
                onClick={handleExportCSV}
              >Export CSV</button>
              <button
                className="mt-2 ml-2 px-3 py-1 rounded bg-muted text-card-foreground font-semibold"
                onClick={() => setShowReportModal(false)}
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
      </div>
    </Card>
  );
};

export default CrewMoraleGauge;
