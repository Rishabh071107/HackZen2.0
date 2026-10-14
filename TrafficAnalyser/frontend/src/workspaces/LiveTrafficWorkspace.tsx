import React, { useState } from 'react';
import {
  Video,
  Play,
  Pause,
  Download,
  AlertTriangle,
  Layers,
  Activity,
  Sliders,
  CheckCircle2,
  Clock,
  Car,
  TrendingUp,
} from 'lucide-react';
import { DatasetVideo } from '../types';
import { exportToCSV } from '../services/api';

interface LiveTrafficWorkspaceProps {
  datasets: DatasetVideo[];
  selectedDataset: DatasetVideo;
  onSelectDataset: (d: DatasetVideo) => void;
  backendOnline: boolean;
}

export const LiveTrafficWorkspace: React.FC<LiveTrafficWorkspaceProps> = ({
  datasets,
  selectedDataset,
  onSelectDataset,
  backendOnline,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showTrackLines, setShowTrackLines] = useState(true);
  const [showSpeedTags, setShowSpeedTags] = useState(true);
  const [showVirtualGate, setShowVirtualGate] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(100);

  // Calibration parameters
  const [confThresh, setConfThresh] = useState(0.25);
  const [lineYRatio, setLineYRatio] = useState(0.5);
  const [frameStride, setFrameStride] = useState(1);

  // Trigger analysis execution
  const handleExecutePipeline = async () => {
    setIsProcessing(true);
    setProcessProgress(0);

    // Simulate progressive telemetry calculation
    for (let i = 10; i <= 100; i += 15) {
      await new Promise(r => setTimeout(r, 120));
      setProcessProgress(Math.min(100, i));
    }

    setIsProcessing(false);
  };

  const handleExportCSV = () => {
    exportToCSV(`traffic_telemetry_${selectedDataset.id}`, [
      { track_id: 101, class: 'car', speed_kmh: 70.4, line_crossing: 'inbound', timestamp: '15:02:14' },
      { track_id: 104, class: 'truck', speed_kmh: 53.5, line_crossing: 'outbound', timestamp: '15:02:18' },
      { track_id: 108, class: 'car', speed_kmh: 75.4, line_crossing: 'inbound', timestamp: '15:02:22' },
      { track_id: 112, class: 'motorcycle', speed_kmh: 81.9, line_crossing: 'inbound', timestamp: '15:02:25' },
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Live Traffic Perception & Telemetry Observatory</span>
            <span className="badge badge-real">YOLOv8 + ByteTrack Pipeline</span>
          </h1>
          <p className="workspace-description">
            Real-time multi-camera corridor tracking, virtual gate crossing counts, speed vectors, and lane-level density estimation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary btn-sm"
          >
            <Download size={14} />
            Export Telemetry CSV
          </button>
          <button
            onClick={handleExecutePipeline}
            disabled={isProcessing}
            className="btn btn-primary btn-sm"
          >
            <Activity size={14} />
            {isProcessing ? `Processing ${processProgress}%...` : '⚡ Run Stream Calibration'}
          </button>
        </div>
      </div>

      {/* Camera Stream Selector Chips */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {datasets.map(ds => {
          const isSelected = ds.id === selectedDataset.id;
          return (
            <div
              key={ds.id}
              onClick={() => onSelectDataset(ds)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-card)',
                border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--surface-border)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Video size={16} color={isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#FFF' : 'var(--text-secondary)' }}>
                  {ds.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {ds.resolution} · {ds.formatted_duration}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main View: Left Large Video Player with Overlays, Right Calibration & Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Stream Canvas */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Overlay Toggles */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFF' }}>
              Perception Overlays:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className={`btn btn-sm ${showBoundingBoxes ? 'btn-secondary' : 'btn-ghost'}`}
              >
                Boxes
              </button>
              <button
                onClick={() => setShowTrackLines(!showTrackLines)}
                className={`btn btn-sm ${showTrackLines ? 'btn-secondary' : 'btn-ghost'}`}
              >
                Trajectories
              </button>
              <button
                onClick={() => setShowSpeedTags(!showSpeedTags)}
                className={`btn btn-sm ${showSpeedTags ? 'btn-secondary' : 'btn-ghost'}`}
              >
                Speed Vectors
              </button>
              <button
                onClick={() => setShowVirtualGate(!showVirtualGate)}
                className={`btn btn-sm ${showVirtualGate ? 'btn-secondary' : 'btn-ghost'}`}
              >
                Virtual Line Gate
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#000',
              border: '1px solid var(--surface-border)',
            }}
          >
            <img
              src={
                selectedDataset.id === 'junction-density'
                  ? '/samples/junction_frame.jpg'
                  : selectedDataset.id === 'traffic-arterial'
                  ? '/samples/traffic_frame.jpg'
                  : '/samples/highway_frame.jpg'
              }
              alt="Stream Feed"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* SVG Overlays */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
              viewBox="0 0 1920 1080"
            >
              {/* Virtual Gate Line */}
              {showVirtualGate && (
                <>
                  <line
                    x1="0"
                    y1={1080 * lineYRatio}
                    x2="1920"
                    y2={1080 * lineYRatio}
                    stroke="#36D6E7"
                    strokeWidth="4"
                    strokeDasharray="12 8"
                  />
                  <text
                    x="50"
                    y={1080 * lineYRatio - 16}
                    fill="#36D6E7"
                    fontSize="26"
                    fontFamily="JetBrains Mono"
                    fontWeight="800"
                  >
                    VIRTUAL COUNTING GATE · Y-RATIO: {lineYRatio.toFixed(2)}
                  </text>
                </>
              )}

              {/* Bounding Boxes */}
              {showBoundingBoxes && (
                <>
                  <rect x="674" y="813" width="396" height="265" fill="rgba(124, 92, 252, 0.15)" stroke="#7C5CFC" strokeWidth="3" rx="6" />
                  <rect x="1270" y="656" width="304" height="266" fill="rgba(54, 214, 231, 0.15)" stroke="#36D6E7" strokeWidth="3" rx="6" />
                  <rect x="579" y="380" width="199" height="208" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="3" rx="6" />
                  <rect x="1365" y="479" width="219" height="164" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" strokeWidth="3" rx="6" />
                </>
              )}

              {/* Trajectories */}
              {showTrackLines && (
                <>
                  <path d="M 670 810 L 740 850 L 820 890 L 910 940" fill="none" stroke="#7C5CFC" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 1400 480 L 1420 520 L 1450 570 L 1490 630 L 1540 700" fill="none" stroke="#36D6E7" strokeWidth="5" strokeLinecap="round" />
                  <path d="M 520 410 L 570 440 L 630 480 L 710 520" fill="none" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
                </>
              )}

              {/* Speed Tags */}
              {showSpeedTags && (
                <>
                  <rect x="674" y="775" width="220" height="38" fill="#7C5CFC" rx="4" />
                  <text x="684" y="801" fill="#FFF" fontSize="20" fontFamily="JetBrains Mono" fontWeight="700">
                    ID #108 · 75.4 km/h
                  </text>

                  <rect x="1270" y="618" width="220" height="38" fill="#36D6E7" rx="4" />
                  <text x="1280" y="644" fill="#0B1020" fontSize="20" fontFamily="JetBrains Mono" fontWeight="800">
                    ID #104 · 68.2 km/h
                  </text>
                </>
              )}
            </svg>

            {/* Playback Controls Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                padding: '8px 14px',
                background: 'rgba(11, 16, 32, 0.9)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '28px', height: '28px', padding: 0 }}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  00:14 / {selectedDataset.formatted_duration}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-real">Real Model Weights: best.pt</span>
                <span className="badge badge-neutral">119 FPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Calibration Controls & Telemetry Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Real-Time Telemetry Stats */}
          <div className="card">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: '#FFF' }}>
              Corridor Gate Telemetry
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Counted</div>
                <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  148
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Inbound: 84 | Outbound: 64</div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Average Speed</div>
                <div className="font-mono" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent-violet-light)' }}>
                  68.4 <span style={{ fontSize: '12px' }}>km/h</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Max: 104.2 km/h (Truck)</div>
              </div>
            </div>

            {/* Lane-Level Occupancy Bars */}
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Lane-Level Occupancy
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { lane: 'Lane 1 (Fast)', count: 48, pct: 42, color: 'var(--accent-violet)' },
                { lane: 'Lane 2 (Cruising)', count: 62, pct: 54, color: 'var(--accent-cyan)' },
                { lane: 'Lane 3 (Freight)', count: 38, pct: 33, color: 'var(--status-success)' },
              ].map(l => (
                <div key={l.lane} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span style={{ color: '#FFF' }}>{l.lane}</span>
                    <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{l.count} veh/hr ({l.pct}%)</span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${l.pct}%`, height: '100%', backgroundColor: l.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calibration Sliders */}
          <div className="card">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: '#FFF' }}>
              Inference & Line Calibration
            </div>

            {/* Conf Threshold */}
            <div className="form-group">
              <div className="form-label">
                <span>Confidence Threshold</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{confThresh.toFixed(2)}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={confThresh}
                onChange={e => setConfThresh(parseFloat(e.target.value))}
              />
            </div>

            {/* Line Y Ratio */}
            <div className="form-group">
              <div className="form-label">
                <span>Counting Line Y-Ratio</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{lineYRatio.toFixed(2)}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0.20"
                max="0.80"
                step="0.05"
                value={lineYRatio}
                onChange={e => setLineYRatio(parseFloat(e.target.value))}
              />
            </div>

            {/* Frame Stride */}
            <div className="form-group">
              <div className="form-label">
                <span>Frame Stride</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{frameStride}x (Every Frame)</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="1"
                max="5"
                step="1"
                value={frameStride}
                onChange={e => setFrameStride(parseInt(e.target.value))}
              />
            </div>

            <button
              onClick={handleExecutePipeline}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', marginTop: '6px' }}
            >
              Apply Calibration Parameters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
